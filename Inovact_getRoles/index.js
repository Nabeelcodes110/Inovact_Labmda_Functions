const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const { getRoles, getRolesWithPrefix } = require('./queries/queries');

exports.handler = async (event, context, callback) => {
  const prefix = event.prefix;

  let response;
  if (prefix) {
    response = await Hasura(getRolesWithPrefix, {
      _role: prefix + '%',
    });
  } else {
    response = await Hasura(getRoles);
  }

  if (response.success) {
    callback(null, response.result);
  } else {
    callback(null, response.errors);
  }
};
