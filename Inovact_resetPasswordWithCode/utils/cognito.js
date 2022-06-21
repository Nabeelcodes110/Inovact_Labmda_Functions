const { CognitoUserPool, CognitoUser } = require('amazon-cognito-identity-js');

const AWS = require('aws-sdk');
AWS.config.region = process.env.REGION;

const poolData = {
  UserPoolId: process.env.USER_POOL_ID, // Your user pool id here
  ClientId: process.env.CLIENT_ID, // Your client id here
};

const userPool = new CognitoUserPool(poolData);

const resetPassword = (email, password, code) =>
  new Promise((resolve, reject) => {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmPassword(code, password, {
      onSuccess: function (result) {
        resolve(true);
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  });

module.exports = {
  resetPassword,
};
