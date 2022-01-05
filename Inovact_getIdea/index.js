const cleanIdeaDoc = require('./utils/cleanIdeaDoc');
const { query: Hasura } = require('./utils/hasura');
const { getIdea, getIdeas } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const id = await events.id;

  if (id) {
    const variables = {
      id,
    };

    const response1 = await Hasura(getIdea, variables);

    if (!response1.success) return callback(null, response1.errors);

    const cleanedIdeas = response1.result.data.idea.map(cleanIdeaDoc);

    callback(null, cleanedIdeas);
  } else {
    const response = await Hasura(getIdeas);

    if (response.success) {
      const cleanedIdeas = response.result.data.idea.map(cleanIdeaDoc);

      callback(null, cleanedIdeas);
    } else {
      callback(null, response.errors);
    }
  }
};
