const { query: Hasura } = require('./utils/hasura');
const { checkIfMember } = require('./queries/queries');
const { updateTeam } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const { team_id, avatar, cognito_sub } = events;

  const response1 = await Hasura(checkIfMember, { team_id, cognito_sub });

  if (!response1.success) return callback(null, response1.errors);
  if (response1.result.data.team_members.length == 0)
    return callback('You are not a member of this team');

  const response2 = await Hasura(updateTeam, { team_id, avatar });

  if (!response2.success) return callback(null, response2.errors);

  callback(null, response2.result);
};
