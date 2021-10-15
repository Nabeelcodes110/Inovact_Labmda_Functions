const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const { getProjects, getProject } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const id = await events.id;

  if (id) {
    const variables = {
      id,
    };

    const response1 = await Hasura(getProject, variables);

    if (!response1.success) return callback(null, response1.errors);

    callback(null, response1.result);
  } else {
    const response = await Hasura(getProjects);

    if (response.success) {
      callback(null, response.result);
    } else {
      callback(null, response.errors);
    }
  }
};
