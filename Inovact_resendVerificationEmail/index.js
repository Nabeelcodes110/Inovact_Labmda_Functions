const AWS = require('aws-sdk');
AWS.config.region = process.env.REGION;

const identity = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event, context, callback) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: event.email,
  };

  const result = await identity.resendConfirmationCode(params).promise();

  callback(null, {
    success: true,
    errorMessage: '',
  });
};
