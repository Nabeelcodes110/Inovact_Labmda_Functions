const { query: Hasura } = require('./utils/hasura');
const cleanIdeaDoc = require('./utils/cleanIdeaDoc');
const {
  getUserIdeasById,
  getUserIdeasByCognitoSub,
} = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  let user_id = events.user_id;

  let query;
  let variables = {
    cognito_sub: events.cognito_sub,
  };

  if (user_id) {
    query = getUserIdeasById;
    variables.user_id = user_id;
  } else {
    query = getUserIdeasByCognitoSub;
  }

  const response = await Hasura(query, variables);

  if (!response.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });

  const cleanedIdeas = response.result.data.idea.map(cleanIdeaDoc);

  callback(null, cleanedIdeas);
};
