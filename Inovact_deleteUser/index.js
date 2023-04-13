const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const { deleteUser } = require('./queries/queries');
const { deleteUser: deleteCognitoUser } = require('./utils/cognito');

exports.handler = async (events, context, callback) => {
  const cognito_sub = events.cognito_sub;

  const variables = {
    cognito_sub,
  };

  const deleteUserResponse = await deleteCognitoUser(events.cognito_sub).catch(
    err => {
      return err;
    }
  );

  if (!deleteUserResponse) {
    callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to delete Account',
      data: null,
    });
  } else {
    callback(null, {
      success: true,
      errorCode: '',
      errorMessage: '',
      data: null,
    });
  }

  const response1 = await Hasura(deleteUser, variables);

  if (response1.success) {
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
      errorMessage: 'Failed to delete Account',
      data: null,
    });
  }
};
