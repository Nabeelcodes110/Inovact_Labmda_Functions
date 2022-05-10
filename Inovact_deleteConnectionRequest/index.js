const { query: Hasura } = require('./utils/hasura');
const { checkCanDeleteRequest } = require('./queries/queries');
const { deleteRequest } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const { cognito_sub, user_id } = events;

  const variables = {
    user_id,
    cognito_sub,
  };

  const response1 = await Hasura(checkCanDeleteRequest, variables);

  if (!response1.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });
  }

  if (response1.result.data.connections_aggregate.aggregate.count == 0) {
    return callback(null, {
      success: false,
      errorCode: 'InvalidRequest',
      errorMessage: 'Request not found',
      data: null,
    });
  }

  const response2 = await Hasura(deleteRequest, variables);

  if (!response2.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });
  }

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
