const { query: Hasura } = require('./utils/hasura');
const {
  getUserThoughtsWithCognitoSub,
  getUserThoughts,
} = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const user_id = events.user_id;

  if (!user_id) {
    const cognito_sub = events.cognito_sub;

    const response = await Hasura(getUserThoughtsWithCognitoSub, {
      cognito_sub,
    });

    if (!response.success) return callback(null, response.errors);

    callback(null, response.result);
  } else {
    const response = await Hasura(getUserThoughts, { user_id });

    if (!response.success) return callback(null, response.errors);

    callback(null, response.result);
  }
};
