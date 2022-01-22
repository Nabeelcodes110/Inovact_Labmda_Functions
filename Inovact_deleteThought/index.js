const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const {
  delete_thought,
  getUserId,
  getThoughtUserId,
} = require('./queries/queries');

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
      errorMessage: 'Failed to find login user',
      data: null,
    });

  const id = await events.id;
  const variable = {
    id,
  };

  const response2 = await Hasura(getThoughtUserId, variable);

  if (!response2.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find thought',
      data: null,
    });

  //check current user
  if (
    response2.result.data.thoughts[0].user_id ==
    response1.result.data.user[0].id
  ) {
    const variables = {
      id,
    };
    const response = await Hasura(delete_thought, variables);

    if (response.success) {
      callback(null, {
        success: true,
        errorCode: '',
        errorMessage: '',
        data: null,
      });
    } else {
      callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed to delete thought',
        data: null,
      });
    }
  } else {
    callback({
      success: false,
      errorCode: 'UnauthorizedUserException',
      errorMessage: 'Only the owner the thought can delete it.',
      data: null,
    });
  }
};
