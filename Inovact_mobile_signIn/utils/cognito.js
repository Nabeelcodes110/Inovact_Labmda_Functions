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

const signIn = (email, password) =>
  new Promise((resolve, reject) => {
    const authenticationData = {
      Username: email,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        resolve({
          success: true,
          errorCode: '',
          errorMessage: '',
          data: {
            idToken: result.idToken.jwtToken,
          },
        });
      },

      onFailure: function (err) {
        console.log(err);
        reject({
          success: false,
          errorCode: 'InvalidPasswordException',
          errorMessage: 'Wrong password',
        });
      },
    });
  });

const getCognitoUser = email =>
  new Promise(async (resolve, reject) => {
    const userParams = {
      UserPoolId: process.env.USER_POOL_ID,
      AttributesToGet: null,
      Filter: `email = \"${email}\"`,
      Limit: 1,
    };
    try {
      const { Users } = await identity.listUsers(userParams).promise();

      if (!Users || Users.length == 0) {
        resolve({
          hasRegistered: false,
          hasVerified: false,
        });
      } else {
        const emailVerifiedAttribute = Users[0].Attributes.find(
          e => e.Name == 'email_verified'
        );

        if (!emailVerifiedAttribute) {
          resolve({
            hasRegistered: false,
            hasVerified: false,
          });
        }

        if (emailVerifiedAttribute.Value == 'true') {
          resolve({
            hasRegistered: true,
            hasVerified: true,
          });
        } else {
          resolve({
            hasRegistered: true,
            hasVerified: false,
          });
        }
      }
    } catch (error) {
      // console.log({ error }, JSON.stringify(error));
      reject({
        hasRegistered: false,
        hasVerified: false,
      });
    }
  });

module.exports = {
  signIn,
  getCognitoUser,
};
