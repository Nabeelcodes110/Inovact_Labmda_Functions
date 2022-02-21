const { query: Hasura } = require('./utils/hasura');
const { rejectInvite } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const invitation_id = events.invitation_id;
  const cognito_sub = events.cognito_sub;

  const variables = {
    invitation_id,
    cognito_sub,
  };

  const response = await Hasura(rejectInvite, variables);

  if (!response.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });

  if (response.result.data.delete_team_invitations.affected_rows === 0)
    return callback(null, {
      success: false,
      errorCode: 'NotFound',
      errorMessage: 'Invitation not found',
      data: null,
    });

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
