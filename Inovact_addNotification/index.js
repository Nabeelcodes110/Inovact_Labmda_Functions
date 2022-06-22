const { query: Hasura } = require('./utils/hasura');
const { addNotifications } = require('./queries/mutations');

exports.handler = async (event, context) => {
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

  return;
};
