const {
  CognitoUserPool,
  CognitoUser,
  CognitoRefreshToken,
} = require('amazon-cognito-identity-js');

const poolData = {
  UserPoolId: process.env.USER_POOL_ID, // Your user pool id here
  ClientId: process.env.CLIENT_ID, // Your client id here
};

const userPool = new CognitoUserPool(poolData);

const refreshAuthToken = (email, refreshToken) =>
  new Promise((resolve, reject) => {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    var token = new CognitoRefreshToken({ RefreshToken: refreshToken });

    cognitoUser.refreshSession(token, (err, session) => {
      if (err) {
        reject({
          success: false,
          errorCode: err.name,
          errorMessage:
            'The refresh token is either invalid or missing, please ensure you are using the exact one received during authentication',
          data: {},
        });
      } else {
        resolve({
          success: true,
          errorCode: '',
          errorMessage: '',
          data: {
            idToken: session.getIdToken().getJwtToken(),
          },
        });
      }
    });
  });

module.exports = {
  refreshAuthToken,
};
