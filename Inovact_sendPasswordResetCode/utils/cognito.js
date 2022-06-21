const { CognitoUserPool, CognitoUser } = require('amazon-cognito-identity-js');

const AWS = require('aws-sdk');
AWS.config.region = process.env.REGION;

const poolData = {
  UserPoolId: process.env.USER_POOL_ID, // Your user pool id here
  ClientId: process.env.CLIENT_ID, // Your client id here
};

const userPool = new CognitoUserPool(poolData);

const sendCode = email =>
  new Promise((resolve, reject) => {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: data => {
        console.log('Success, but code not sent!');
        resolve(false);
      },
      onFailure: err => {
        reject();
      },
      inputVerificationCode: data => {
        resolve(true);
      },
    });
  });

module.exports = {
  sendCode,
};
