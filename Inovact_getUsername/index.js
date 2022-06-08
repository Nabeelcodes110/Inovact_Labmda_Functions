const { query: Hasura } = require('./utils/hasura');
const { getUsernameFromEmail } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const email = events.email;

  const response = await Hasura(getUsernameFromEmail, { email });

  if (!response.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });
  }

  if (response.result.data.user.length == 0) {
    return callback(null, {
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'User not found',
      data: null,
    });
  }

  callback(null, {
    success: true,
    errorCode: null,
    errorMessage: null,
    data: response.result.data.user[0].user_name,
  });
};
