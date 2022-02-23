const { query: Hasura } = require('./utils/hasura');
const { possibleToJoinTeam } = require('./queries/queries.js');
const { addTeamRequest } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const team_id = events.team_id;
  const cognito_sub = events.cognito_sub;

  const variables = {
    team_id,
    cognito_sub,
  };

  const response = await Hasura(possibleToJoinTeam, variables);

  if (!response.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });

  if (response.result.data.team_members.length > 0)
    return callback(null, {
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are already a member of this team.',
      data: null,
    });

  if (response.result.data.team_invitations.length > 0)
    return callback(null, {
      success: false,
      errorCode: 'Forbidden',
      errorMessage:
        'You have received an invitation from this team. Please act on that',
      data: null,
    });

  if (
    response.result.data.team.length == 0 ||
    !response.result.data.team[0].looking_for_members
  )
    return callback(null, {
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'This team is not looking for members.',
      data: null,
    });

  const user_id = response.result.data.user[0].id;

  const response1 = await Hasura(addTeamRequest, { team_id, user_id });

  if (!response1.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
