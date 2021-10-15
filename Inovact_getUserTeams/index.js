const { query: Hasura } = require('./utils/hasura');
const { getUserTeams, getUserId } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  let user_id = events.user_id;

  if (!user_id) {
    // Find user id
    const cognito_sub = events.cognito_sub;
    const response1 = await Hasura(getUserId, {
      cognito_sub: { _eq: cognito_sub },
    });

    if (!response1.success) return callback(null, response1.errors);

    user_id = response1.result.data.user[0].id;
  }

  const variables = {
    user_id,
  };

  const response2 = await Hasura(getUserTeams, variables);

  if (!response2.success) return callback(null, response2.errors);

  callback(null, response2.result);
};
