const cleanThoughtDoc = require('./utils/cleanThoughtDoc');
const { query: Hasura } = require('./utils/hasura');
const { getThought, getThoughts } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const id = await events.id;

  if (id) {
    const variables = {
      id,
      cognito_sub: events.cognito_sub,
    };

    const response1 = await Hasura(getThought, variables);

    if (!response1.success)
      return callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response1.errors),
        data: null,
      });

    const cleanedThoughts = response1.result.data.thoughts.map(cleanThoughtDoc);

    callback(null, cleanedThoughts);
  } else {
    const variables = {
      cognito_sub: events.cognito_sub,
    };

    const response = await Hasura(getThoughts, variables);

    if (!response.success) {
      return callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response.errors),
        data: null,
      });
    }

    const cleanedThoughts = response.result.data.thoughts.map(cleanThoughtDoc);

    callback(null, cleanedThoughts);
  }
};
