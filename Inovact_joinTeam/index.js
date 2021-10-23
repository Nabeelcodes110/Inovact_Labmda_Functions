const { query: Hasura } = require('./utils/hasura');
const { checkTeamMember, getUserId } = require('./queries/queries.js');
const { addTeamRequest } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const team_id = events.team_id;
  const cognito_sub = events.cognito_sub;

  const response1 = await Hasura(checkTeamMember, { team_id, cognito_sub });

  if (!response1.success) return callback(null, response1.errors);

  if (response1.result.data.team_members.length)
    return callback({
      message: "Can't request to join a team you are already a member of",
    });

  // Find user id
  const response2 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response2.success) return callback(null, response2.errors);

  const user_id = response2.result.data.user[0].id;

  const response3 = await Hasura(addTeamRequest, { team_id, user_id });

  if (!response3.success) return callback(null, response3.errors);

  callback(null, response3.result);
};
