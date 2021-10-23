const { query: Hasura } = require('./utils/hasura');
const { getInvitationDetails } = require('./queries/queries');
const { addMembers, deleteInvitation } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const invitation_id = events.invitation_id;
  const cognito_sub = events.cognito_sub;

  const response2 = await Hasura(getInvitationDetails, { id: invitation_id });

  if (!response2.success) return callback(null, response2.errors);

  if (response2.result.data.team_invitations[0].user.cognito_sub != cognito_sub)
    return callback('You cant accept invites sent to others');

  const memberData = {
    objects: [
      {
        user_id: response2.result.data.team_invitations[0].user_id,
        team_id: response2.result.data.team_invitations[0].team_id,
      },
    ],
  };

  const response3 = await Hasura(addMembers, memberData);

  if (!response3.success) return callback(null, response3.errors);

  const response4 = await Hasura(deleteInvitation, { id: request_id });

  callback(null, response3.result);
};
