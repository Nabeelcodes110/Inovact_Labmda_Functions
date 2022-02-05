const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const { deletequery } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const id = await events.id;

  const variables = await {
    id,
  };
  const response = await Hasura(deletequery, variables);

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
      errorMessage: '',
      data: null,
    });
  }
};
