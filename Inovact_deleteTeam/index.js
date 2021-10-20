const { query: Hasura } = require('./utils/hasura');
const { deleteTeam } = require('./queries/mutations');
const { getUserId, checkTeamAdmin } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const team_id = await events.team_id;

  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response1.success) return callback(null, response1.errors);

  // Check if the current user is an admin of that team
  const checkAdminData = {
    team_id,
    user_id: response1.result.data.user[0].id,
  };

  const response2 = await Hasura(checkTeamAdmin, checkAdminData);

  if (!response2.success) return callback(null, response2.errors);

  // If not
  if (
    !response2.result.data.team_members.length ||
    !response2.result.data.team_members[0].admin
  )
    return callback('Only team admin can delete the team');

  // If yes
  const response3 = await Hasura(deleteTeam, { team_id });

  if (!response3.success) return callback(null, response3.errors);

  callback(null, response3.result);
};
