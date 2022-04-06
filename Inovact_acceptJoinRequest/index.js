const { query: Hasura } = require('./utils/hasura');
const { checkIfPossibleToAccept, getRoleRequirement } = require('./queries/queries');
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

  const response2 = await Hasura(getRoleRequirement, { roleRequirementId: response1.result.data.team_requests[0].role_requirement_id })

  if (!response2.success) return callback(null, {
    success: false,
    errorCode: "InternalServerError",
    errorMessage: "Failed to get role requirement details",
    data: null
  })

  const variables2 = {
    team_id: response1.result.data.team_requests[0].team_id,
    user_id: response1.result.data.team_requests[0].user_id,
    role: response2.result.data.team_role_requirements[0].role_name,
    role_requirement_id: response1.result.data.team_requests[0].role_requirement_id,
    request_id,
  };

  const response3 = await Hasura(acceptJoinRequest, variables2);

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
