const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const { delete_idea } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const id = await events.id;

  if (id) {
    const variables = await {
      id,
    };
    const response = await Hasura(delete_idea, variables);

    if (response.success) {
      callback(null, {
        success: true,
        errorCode: '',
        errorMessage: '',
        data: null,
      });
    } else {
      callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed to delete thought',
        data: null,
      });
    }
  } else {
    callback({
      success: false,
      errorCode: 'InvalidInput',
      errorMessage: 'Invalid or id not found',
      data: null,
    });
  }
};
