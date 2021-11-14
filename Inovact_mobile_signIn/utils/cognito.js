const {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
} = require('amazon-cognito-identity-js');

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
          errorMessage: '',
          data: {
            idToken: result.idToken.jwtToken,
          },
        });
      },

      onFailure: function (err) {
        reject({
          success: false,
          errorMessage: 'InvalidCredentialsException',
        });
      },
    });
  });

module.exports = {
  signIn,
};
