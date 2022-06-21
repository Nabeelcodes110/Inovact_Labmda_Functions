const { query: Hasura } = require('./utils/hasura');
const { getNotifications } = require('./queries/queries');
const cleanNotificationDoc = require('./utils/cleanNotificationDoc');

exports.handler = async (events, context, callback) => {
  const { cognito_sub } = events;

  const response = await Hasura(getNotifications, { cognito_sub });

  if (!response.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to fetch notifications',
      data: null,
    });
  }

  const notifications =
    response.result.data.notification.map(cleanNotificationDoc);

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: notifications,
  });
};
