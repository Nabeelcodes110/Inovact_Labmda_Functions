const { query: Hasura } = require('./utils/hasura');
const { possibleToJoinTeam } = require('./queries/queries.js');
const {
  addTeamRequestByStudent,
  addTeamRequestByMentor,
  addTeamRequestByEntrepreneurAsMember,
  addTeamRequestByEntrepreneurAsMentor,
} = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const team_id = events.team_id;
  const roleRequirementId = events.role_requirement_id;
  const cognito_sub = events.cognito_sub;

  const variables = {
    team_id,
    role_requirement_id: roleRequirementId,
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

  if (response.result.data.team.length == 0)
    return callback(null, {
      success: false,
      errorCode: 'NotFoundError',
      errorMessage: 'Team not found',
      data: null,
    });

  if (response.result.data.team_members.length > 0)
    return callback(null, {
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are already a member of this team.',
      data: null,
    });

  if (response.result.data.team_requests.length > 0)
    return callback(null, {
      success: false,
      errorCode: 'Forbidden',
      errorMessage:
        'You have already requested to join this team for this role.',
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

  const user_id = response.result.data.user[0].id;

  let query;
  let variables1;

  if (response.result.data.user[0].role == 'student') {
    if (!response.result.data.team[0].looking_for_members)
      return callback(null, {
        success: false,
        errorCode: 'Forbidden',
        errorMessage: 'This team is not looking for members',
        data: null,
      });

    query = addTeamRequestByStudent;

    variables1 = {
      team_id,
      roleRequirementId,
      user_id,
    };
  } else if (response.result.data.user[0].role == 'entrepreneur') {
    if (response.result.data.team[0].user.role == 'student') {
      if (!response.result.data.team[0].looking_for_mentors)
        return callback(null, {
          success: false,
          errorCode: 'Forbidden',
          errorMessage: 'This team is not looking for mentors',
          data: null,
        });

      query = addTeamRequestByEntrepreneurAsMentor;

      variables1 = {
        team_id,
        user_id,
      };
    } else {
      if (!response.result.data.team[0].looking_members) {
        return callback(null, {
          success: false,
          errorCode: 'Forbidden',
          errorMessage: 'This team is not looking for members',
          data: null,
        });
      }

      query = addTeamRequestByEntrepreneurAsMember;

      variables1 = {
        user_id,
        roleRequirementId,
        team_id,
      };
    }
  } else {
    if (!response.result.data.team[0].looking_for_mentors)
      return callback(null, {
        success: false,
        errorCode: 'Forbidden',
        errorMessage: 'This team is not looking for mentors',
        data: null,
      });

    query = addTeamRequestByMentor;

    variables1 = {
      team_id,
      user_id,
    };
  }

  const response1 = await Hasura(query, variables1);

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
