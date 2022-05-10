const { query: Hasura } = require('./utils/hasura');
const { deleteAreaOfInterest } = require('./queries/mutations');

exports.handler = async (event, context, callback) => {
  const { cognito_sub, interest_ids } = event;

  const variables = {
    cognito_sub,
    interest_ids,
  };

  const response = await Hasura(deleteAreaOfInterest, variables);

  if (!response.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
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
