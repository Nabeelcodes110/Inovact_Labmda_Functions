const { query: Hasura } = require('./utils/hasura');
const { checkIfMember } = require('./queries/queries');
const { updateTeam } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const {
    team_id,
    avatar,
    cognito_sub,
    team_name,
    looking_for_members,
    looking_for_mentors,
    team_on_inovact,
  } = events;

  const variables = {
    team_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkIfMember, variables);

  if (!response1.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to check if user is admin',
      data: null,
    });

  if (
    response1.result.data.team_members.length == 0 ||
    !response1.result.data.team_members[0].admin
  )
    return callback(null, {
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'User is not an admin of the team',
      data: null,
    });

  let updates = {
    avatar,
  };

  if (team_name) updates.name = team_name;
  if (looking_for_members) updates.looking_for_members = looking_for_members;
  if (looking_for_mentors) updates.looking_for_mentors = looking_for_mentors;
  if (team_on_inovact) updates.team_on_inovact = team_on_inovact;

  const variables2 = {
    team_id,
    updates,
  };

  const response2 = await Hasura(updateTeam, variables2);

  if (!response2.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to update team',
      data: null,
    });

  return callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
