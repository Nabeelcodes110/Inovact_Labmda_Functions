const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const { addUserCause } = require('./queries/mutations');
const { deleteUser: deleteUserQuery, getUserId } = require('./queries/queries');
const { deleteUser: deleteCognitoUser } = require('./utils/cognito');
const cron = require('node-cron');

exports.handler = async (events, context, callback) => {
  const cognito_sub = events.cognito_sub;
  const cause = events.cause;

  const response = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response.success) {
    return res.json({
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });
  }

  const id = response.result.data.user[0].id;

  const deleteUserResponse = await deleteCognitoUser(events.cognito_sub).catch(
    err => {
      return err;
    }
  );

  if (!deleteUserResponse) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to delete Account',
      data: null,
    });
  }

  const variables = {
    id,
    cause,
  };

  const response1 = await Hasura(addUserCause, variables);

  if (!response1.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to delete Account',
      data: null,
    });
  }

  const response2 = await Hasura(deleteUserQuery, { cognito_sub });

  if (!response2.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to delete Account',
      data: null,
    });
  }

  return callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
