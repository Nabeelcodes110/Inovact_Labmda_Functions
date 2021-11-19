const { add_likeIdea, delete_like } = require('./queries/mutations');
const { getUserId, getideaId } = require('./queries/queries');

const { query: Hasura } = require('./utils/hasura');

exports.handler = async (events, context, callback) => {
  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response1.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find logged in user',
    });

  const variable = await {
    user_id: response1.result.data.user[0].id,
    idea_id: events.idea_id,
  };
  const response = await Hasura(getideaId, variable);
  if (!response.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find idea',
    });

  if (response.result.data.idea_like.length == 0) {
    const response2 = await Hasura(add_likeIdea, variable);

    // If failed to insert project return error
    if (!response2.success)
      return callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed to like the thought',
      });

    callback(null, {
      success: true,
      errorCode: '',
      errorMessage: '',
      data: 'Added a like',
    });
  } else {
    const response3 = await Hasura(delete_like, variable);

    if (!response3.success)
      return callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed to unlike the thought',
      });

    callback(null, {
      success: true,
      errorCode: '',
      errorMessage: '',
      data: 'Removed a like',
    });
  }
};
