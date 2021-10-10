const axios = require("axios");
const { query: Hasura } = require("./utils/hasura");
const { updatePost_query } = require("./queries/queries");

exports.handler = async (events, context, callback) => {
  let variables = await {
    id: {
      _eq: events.id,
    },
    changes: {},
  };

  if (events.caption) variables["changes"]["caption"] = events.caption;
  if (events.description)
    variables["changes"]["description"] = events.description;
  if (events.title) variables["changes"]["title"] = events.title;

  const response = await Hasura(updatePost_query, variables);

  if (response.success) {
    callback(null, response.result);
  } else {
    callback(null, response.errors);
  }
};
