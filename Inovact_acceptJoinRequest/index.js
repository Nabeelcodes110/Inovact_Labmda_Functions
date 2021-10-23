const { query: Hasura } = require('./utils/hasura');
const { checkIfAdmin, getRequestDetails } = require('./queries/queries');
const { addMembers, deleteJoinRequest } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const request_id = events.request_id;
  const cognito_sub = events.cognito_sub;

  const response1 = await Hasura(checkIfAdmin, { cognito_sub, request_id });

  if (!response1.success) return callback(null, response1.errors);

  if (!response1.result.data.team_members[0].admin)
    return callback({ message: 'Only admins can accept requests' });

  const response2 = await Hasura(getRequestDetails, { id: request_id });

  if (!response2.success) return callback(null, response2.errors);

  const memberData = {
    objects: [
      {
        user_id: response2.result.data.team_requests[0].user_id,
        team_id: response2.result.data.team_requests[0].team_id,
      },
    ],
  };

  const response3 = await Hasura(addMembers, memberData);

  if (!response3.success) return callback(null, response3.errors);

  const response4 = await Hasura(deleteJoinRequest, { id: request_id });

  callback(null, response3.result);
};
