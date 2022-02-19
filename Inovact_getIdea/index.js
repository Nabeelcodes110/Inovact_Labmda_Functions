const cleanIdeaDoc = require('./utils/cleanIdeaDoc');
const { query: Hasura } = require('./utils/hasura');
const { getIdea, getIdeas } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const id = await events.id;

  if (id) {
    const variables = {
      id,
      cognito_sub: events.cognito_sub,
    };

    const response1 = await Hasura(getIdea, variables);

    if (!response1.success)
      return callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response1.errors),
        data: null,
      });

    const cleanedIdeas = response1.result.data.idea.map(cleanIdeaDoc);

    callback(null, cleanedIdeas[0]);
  } else {
    const variables = {
      cognito_sub: events.cognito_sub,
    };

    const response = await Hasura(getIdeas, variables);

    if (response.success) {
      const cleanedIdeas = response.result.data.idea.map(cleanIdeaDoc);

      callback(null, cleanedIdeas);
    } else {
      callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response.errors),
        data: null,
      });
    }
  }
};
