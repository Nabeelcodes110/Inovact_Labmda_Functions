const { query: Hasura } = require('./utils/hasura');
const { getUserId, getUserIdeas } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  let user_id = events.user_id;

  if (!user_id) {
    // Find user id
    const cognito_sub = events.cognito_sub;
    const response1 = await Hasura(getUserId, {
      cognito_sub: { _eq: cognito_sub },
    });

    // If failed to find user return error
    if (!response1.success) return callback(null, response1.errors);

    user_id = response1.result.data.user[0].id;
  }

  const variables = {
    user_id,
  };

  const response1 = await Hasura(getUserIdeas, variables);

  if (!response1.success) return callback(null, response1.errors);

  callback(null, response1.result);
};
