const { query: Hasura } = require('./utils/hasura');
const { getUserId, getConnection } = require('./queries/queries');
const { addConnection } = require('./queries/mutations');

exports.handler = (event, context, callback) => {
  const user_id = event.user_id;

  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success) return callback(null, response1.errors);

  // Check if connection already exists
  const variables = {
    user1: response1.result.data.user[0].id,
    user2: user_id,
  };

  const response2 = await Hasura(getConnection, variables);

  if (!response2.success) return callback(null, response2.errors);
  if (response2.result.data.connections.length)
    return callback('Connection already exists');

  // Add the connection
  const response3 = await Hasura(addConnection, variables);

  if (!response3.success) callback(null, response3.errors);

  callback(null);
};
