const { query: Hasura } = require('./utils/hasura');
const { checkIfCanDelete } = require('./queries/queries.js');
const { deleteTeamMember } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const { user_id, cognito_sub, team_id } = events;

  const variables = {
    team_id,
    user_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkIfCanDelete, variables);

  if (!response1.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });
  }

  if (response1.result.data.admins.length == 0) {
    return callback(null, {
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are not an admin of this team.',
      data: null,
    });
  }

  if (response1.result.data.members.length == 0) {
    return callback(null, {
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'Given user is not a member of this team.',
      data: null,
    });
  }

  if (response1.result.data.members[0].admin) {
    return callback(null, {
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You cannot remove an admin of this team.',
      data: null,
    });
  }

  const variables2 = {
    user_id,
    team_id,
  };

  const response2 = await Hasura(deleteTeamMember, variables2);

  if (!response2.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });
  }

  return callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
