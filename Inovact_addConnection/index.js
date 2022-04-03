const { query: Hasura } = require('./utils/hasura');
const { getUserId, checkValidRequest } = require('./queries/queries');
const { addConnection } = require('./queries/mutations');

exports.handler = async (event, context, callback) => {
  const user_id = event.user_id;

  // Find user id
  const cognito_sub = event.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success) return callback(null, response1.errors);

  // Check if request is possible
  // 1. Check if user exists
  // 2. Check if user is already requested
  const variables = {
    user1: response1.result.data.user[0].id,
    user2: user_id,
  };

  const response2 = await Hasura(checkValidRequest, variables);
  
  if (!response2.success) return callback(null, response2.errors);

  // 1. Check if user exists
  if (response2.result.data.user.length == 0) return callback(null, {
    success: false,
    errors: "InvalidUserId",
    errorMessage: "The user you are trying to connect to does not exist.",
    data: null
  })
  
  // 2. Check if user is already requested
  if (response2.result.data.connections.length)
    return callback(null, {
      success: false,
      errorCode: 'ConnectionExistsError',
      errorMessage: 'Cannot connect to a person you are already connected with',
      data: null,
    });

  // Add the connection
  const response3 = await Hasura(addConnection, variables);

  if (!response3.success) callback(null, response3.errors);

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
