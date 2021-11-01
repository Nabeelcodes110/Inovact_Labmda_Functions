const { add_likeThought, delete_like } = require('./queries/mutations');
const { getUserId, getThoughtId } = require('./queries/queries');

const { query: Hasura } = require('./utils/hasura');

exports.handler = async (events, context, callback) => {
  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response1.success) return callback(null, response1.errors);

  const variable = await {
    user_id: response1.result.data.user[0].id,
    thought_id: events.thought_id,
  };
  const response = await Hasura(getThoughtId, variable);
  if (!response.success) return callback(null, response.errors);

  if (response.result.data.thought_likes.length == 0) {
    const response2 = await Hasura(add_likeThought, variable);

    // If failed to insert project return error
    if (!response2.success) return callback(null, response2.errors);

    callback(null, response2.result);
  } else {
    const response3 = await Hasura(delete_like, variable);

    callback(null, response3.result);
  }
};
