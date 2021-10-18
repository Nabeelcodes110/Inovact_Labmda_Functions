const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const { getTags, getTagsWithPrefix } = require('./queries/queries');

exports.handler = async (event, context, callback) => {
  const prefix = event.prefix;

  let response;
  if (prefix) {
    response = await Hasura(getTagsWithPrefix, {
      _tag: prefix + '%',
    });
  } else {
    response = await Hasura(getTags);
  }

  if (response.success) {
    callback(null, response.result);
  } else {
    callback(null, response.errors);
  }
};
