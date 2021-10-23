const { query: Hasura } = require('./utils/hasura');
const { getInvitationDetails } = require('./queries/queries');
const { deleteInvitation } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const invitation_id = events.invitation_id;
  const cognito_sub = events.cognito_sub;

  const response2 = await Hasura(getInvitationDetails, { id: invitation_id });

  if (!response2.success) return callback(null, response2.errors);

  if (response2.result.data.team_invitations[0].user.cognito_sub != cognito_sub)
    return callback('You cant reject invites sent to others');

  const response4 = await Hasura(deleteInvitation, { id: invitation_id });

  if (!response4.success) return callback(null, response4.errors);

  callback(null, response4.result);
};
