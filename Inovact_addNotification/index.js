const { query: Hasura } = require('./utils/hasura');
const { addNotificationObject } = require('./queries/mutations');

exports.handler = async (event, context) => {
  const entityTypeId = event.eventTypeId;
  const entityId = event.entityId;
  const actorId = event.actorId;
  const notifierIds = event.notifierIds;

  const response1 = await Hasura(addNotificationObject, {
    entityId,
    entityTypeId,
  });

  if (!response1.success) {
    return;
  }

  const notificationChange = {
    notification_object_id:
      response1.result.data.insert_notification_object.returning[0].id,
    actor_id: actorId,
  };

  const notifications = notifierIds.map(notifierId => ({
    notification_object_id:
      response1.result.data.insert_notification_object.returning[0].id,
    notifier_id: notifierId,
  }));

  const variables = {
    notificationChanges: [notificationChange],
    notifications,
  };

  const response2 = await Hasura(addNotificationObject, variables);
};
