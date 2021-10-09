const axios = require("axios");
const { query: Hasura } = require("./utils/hasura");
const { getAreaOfInterests } = require("./queries/queries");

exports.handler = async (event, context, callback) => {
  const response = await Hasura(getAreaOfInterests);

  if (response.success) {
    callback(null, response.result);
  } else {
    callback(null, response.errors);
  }
};
