const { query: Hasura } = require('./utils/hasura');
const { getMyTeams, getUserId, getTeam } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const team_id = events.team_id;

  if (team_id) {
    const variables = {
      team_id,
    };

    const response1 = await Hasura(getTeam, variables);

    if (!response1.success) return callback(null, response1.errors);

    callback(null, response1.result);
  } else {
    // Find user id
    const cognito_sub = events.cognito_sub;
    const response1 = await Hasura(getUserId, {
      cognito_sub: { _eq: cognito_sub },
    });

    if (!response1.success) return callback(null, response1.errors);

    const variables = {
      user_id: response1.result.data.user[0].id,
    };

    const response2 = await Hasura(getMyTeams, variables);

    if (!response2.success) return callback(null, response2.errors);

    callback(null, response2.result);
  }
};
