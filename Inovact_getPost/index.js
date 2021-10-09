const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const { getProjects } = require('./queries/queries');

exports.handler = async (event, context, callback) => {
  const response = await Hasura(getProjects);

  if (response.success) {
    callback(null, response.result);
  } else {
    callback(null, response.errors);
  }
};
