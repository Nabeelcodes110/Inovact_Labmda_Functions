const { query: Hasura } = require('./utils/hasura');
const { getInvitationDetails } = require('./queries/queries');
const { acceptInvite } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const invitation_id = events.invitation_id;
  const cognito_sub = events.cognito_sub;

  const response2 = await Hasura(getInvitationDetails, { id: invitation_id });

  if (!response2.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });

  // Check if the user is the one invited
  if (response2.result.data.team_invitations[0].user.cognito_sub != cognito_sub)
    return callback(null, {
      success: false,
      errorCode: 'Unauthorized',
      errorMessage: 'You are not the one invited',
      data: null,
    });

  const variables = {
    user_id: response2.result.data.team_invitations[0].user_id,
    team_id: response2.result.data.team_invitations[0].team_id,
    invitation_id: invitation_id,
  };

  const response3 = await Hasura(acceptInvite, variables);

  if (!response3.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response3.errors),
      data: null,
    });

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
