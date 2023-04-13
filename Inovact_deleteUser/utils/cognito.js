const {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
} = require('amazon-cognito-identity-js');

const AWS = require('aws-sdk');
AWS.config.region = process.env.REGION;

const identity = new AWS.CognitoIdentityServiceProvider();

const poolData = {
  UserPoolId: process.env.USER_POOL_ID, // Your user pool id here
  ClientId: process.env.CLIENT_ID, // Your client id here
};

const userPool = new CognitoUserPool(poolData);

const deleteUser = async cognito_sub => {
  await identity
    .adminDeleteUser({
      UserPoolId: poolData.UserPoolId,
      UserID: cognito_sub,
    })
    .promise()
    .then(() => {
      return true;
    })
    .catch(err => {
      return false;
    });
};

module.exports = { deleteUser };
