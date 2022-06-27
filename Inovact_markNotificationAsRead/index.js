const { markNotificationAsRead } = require('./queries/mutations');

const { query: Hasura } = require('./utils/hasura');

exports.handler = async (event, context, callback) => {
  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });

  const { cognito_sub, ids } = event;

  const variables = {
    cognito_sub,
    ids,
  };

  const response = await Hasura(markNotificationAsRead, variables);

  if (!response.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });
  }

  return;
};
