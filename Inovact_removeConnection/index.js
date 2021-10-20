const { query: Hasura } = require('./utils/hasura');
const { getUserId } = require('./queries/queries');
const { removeConnection } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const user_id = events.user_id;

  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response1.success) return callback(null, response1.errors);

  // Fetch connection
  const variables = {
    user2: response1.result.data.user[0].id,
    user1: user_id,
  };

  const response2 = await Hasura(removeConnection, variables);

  if (!response2.success) callback(null, response2.errors);

  callback(null, response2.result);
};
