const { query: Hasura } = require('./utils/hasura');
const { addNotifications } = require('./queries/mutations');
const { getUserName } = require('./queries/queries');
const { notify } = require('./utils/oneSignal');
const entityTypeIdToMessageMapping = require('./utils/entityTypeIdToMessageMapping');

exports.handler = async (event, context) => {
  // ----------------------------------------
  // Record Format:
  // ----------------------------------------
  // {
  //  "entityTypeId" : number;
  //  "entityId" : number;
  //  "actorId" : number;
  //  "notifierIds" : number[];
  // }
  // ----------------------------------------

  const records = event.Records;

  if (records.length === 0) return;

  let objects = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const payload = JSON.parse(record.body);

    objects.push({
      entity_id: payload.entityId,
      entity_type_id: payload.entityTypeId,
      notification_changes: {
        data: [
          {
            actor_id: payload.actorId,
          },
        ],
      },
      notifications: {
        data: payload.notifierIds.map(notifierId => ({
          notifier_id: notifierId,
        })),
      },
    });
  }

  const response = await Hasura(addNotifications, { objects });

  if (!response.success) {
    console.log(response.errors);
    throw new Error('Failed to add notifications. Check logs for details.');
  }

  // Send notifications on One Signal
  // ----------------------------------------
  // 1. Get all actor names
  const actorIds = objects.map(
    object => object.notification_changes.data[0].actor_id
  );

  const response1 = await Hasura(getUserName, { ids: actorIds });

  if (!response1.success) {
    console.log(response1.errors);
    throw new Error('Failed to get user names. Check logs for details.');
  }

  // Create a dictionary of actorId and actorName
  const actorNames = response1.result.data.user.reduce((acc, user) => {
    acc[user.id] = user.first_name + ' ' + user.last_name;
    return acc;
  }, {});

  // 2. Send notifications on One Signal
  for (const object of objects) {
    const actorName = actorNames[object.notification_changes.data[0].actor_id];
    const message = entityTypeIdToMessageMapping[object.entity_type_id];
    const notificationMessage = `${actorName} ${message}`;

    const response = await notify(
      notificationMessage,
      object.notifications.data
        .map(notification => notification.notifier_id)
        .map(String)
    );
  }

  return;
};
