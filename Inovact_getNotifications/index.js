const { query: Hasura } = require('./utils/hasura');
const { getNotifications } = require('./queries/queries');

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

  // const notifications = prepareNotifications(response.result.data.notification);

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: response.result.data.notification,
  });
};
