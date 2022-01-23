const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const { getThought, getThoughts } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const id = await events.id;

  if (id) {
    const variables = {
      id,
    };

    const response1 = await Hasura(getThought, variables);

    if (!response1.success) return callback(null, response1.errors);

    if (response1.result.data.thoughts.length == 0) {
      return callback(null, []);
    }

    let thought = response1.result.data.thoughts[0];

    thought.thought_likes = thought.thought_likes.result.count;

    callback(null, thought);
  } else {
    const response = await Hasura(getThoughts);

    if (!response.success) {
      return callback(null, response.errors);
    }

    const thoughts = response.result.data.thoughts.map(thought => {
      thought.thought_likes = thought.thought_likes.result.count;
      return thought;
    });

    callback(null, thoughts);
  }
};
