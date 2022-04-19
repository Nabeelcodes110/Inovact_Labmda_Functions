const { makeAdmin } = require('./queries/mutations');
const { checkIfCanMakeAdmin } = require('./queries/queries');
const { query: Hasura } = require('./utils/hasura');

exports.handler = async (events, context, callback) => {
  const { user_id, team_id, cognito_sub } = events;

  const variables = {
    user_id,
    team_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkIfCanMakeAdmin, variables);

  if (!response1.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
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
      errorMessage: 'Given user is already an admin of this team.',
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

  const response2 = await Hasura(makeAdmin, { team_id, user_id });

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
