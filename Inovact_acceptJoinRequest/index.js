const { query: Hasura } = require('./utils/hasura');
const { checkIfPossibleToAccept } = require('./queries/queries');
const { acceptJoinRequest } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const request_id = events.request_id;
  const cognito_sub = events.cognito_sub;

  const variables = {
    request_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkIfPossibleToAccept, variables);

  if (!response1.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });

  if (response1.result.data.team_requests.length == 0)
    return callback(null, {
      success: false,
      errorCode: 'InvalidRequest',
      errorMessage: 'Request not found',
      data: null,
    });

  if (
    response1.result.data.team_members.length == 0 ||
    !response1.result.data.team_members[0].admin
  )
    return callback(null, {
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are not an admin of this team',
      data: null,
    });

  const variables2 = {
    team_id: response1.result.data.team_requests[0].team_id,
    user_id: response1.result.data.team_requests[0].user_id,
    request_id,
  };

  const response2 = await Hasura(acceptJoinRequest, variables2);

  if (!response2.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
