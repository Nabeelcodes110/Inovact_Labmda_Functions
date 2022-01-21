const { query: Hasura } = require('./utils/hasura');
const { addThought } = require('./queries/mutations');
const { getUser, getThought } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success)
    callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find login user',
    });

  const thoughtData = {
    thought: events.thought,
    user_id: response1.result.data.user[0].id,
  };

  const response2 = await Hasura(addThought, thoughtData);

  // If failed to insert thought return error
  if (!response2.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to save thought',
    });

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
