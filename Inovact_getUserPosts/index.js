const { query: Hasura } = require('./utils/hasura');
const { getUserId, getUserPosts } = require('./queries/queries');
const cleanPostDoc = require('./utils/cleanPostDoc');

exports.handler = async (events, context, callback) => {
  let user_id = events.user_id;

  if (!user_id) {
    // Find user id
    const cognito_sub = events.cognito_sub;
    const response1 = await Hasura(getUserId, {
      cognito_sub: { _eq: cognito_sub },
    });

    // If failed to find user return error
    if (!response1.success)
      return callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response1.errors),
        data: null,
      });

    user_id = response1.result.data.user[0].id;
  }

  const variables = {
    user_id,
    cognito_sub: events.cognito_sub,
  };

  const response1 = await Hasura(getUserPosts, variables);

  if (!response1.success) return callback(null, response1.errors);

  const cleanedPosts = response1.result.data.project.map(cleanPostDoc);

  callback(null, cleanedPosts);
};
