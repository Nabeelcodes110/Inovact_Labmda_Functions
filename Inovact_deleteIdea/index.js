const axios = require("axios");
const { query: Hasura } = require("./utils/hasura");
const { delete_idea } = require("./queries/queries");

exports.handler = async (events, context, callback) => {
  const id = await events.id;

  if (id) {
    const variables = await {
      id,
    };
    const response = await Hasura(delete_idea, variables);

    if (response.success) {
      callback(null, response.result);
    } else {
      callback(null, response.errors);
    }
  } else {
    callback({
      message: "Invalid or id not found",
    });
  }
};
