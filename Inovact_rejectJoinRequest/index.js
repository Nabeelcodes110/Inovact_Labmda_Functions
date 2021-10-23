const { query: Hasura } = require('./utils/hasura');
const { checkIfAdmin } = require('./queries/queries');
const { deleteJoinRequest } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const request_id = events.request_id;
  const cognito_sub = events.cognito_sub;

  const response1 = await Hasura(checkIfAdmin, { cognito_sub, request_id });

  if (!response1.success) return callback(null, response1.errors);

  if (!response1.result.data.team_members[0].admin)
    return callback({ message: 'Only admins can reject requests' });

  const response2 = await Hasura(deleteJoinRequest, { id: request_id });

  if (!response2.success) return callback(null, response2.errors);

  callback(null, response2.result);
};
