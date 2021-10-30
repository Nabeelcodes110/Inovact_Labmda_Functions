const { CognitoUserPool } = require('amazon-cognito-identity-js');

const poolData = {
  UserPoolId: process.env.USER_POOL_ID, // Your user pool id here
  ClientId: process.env.CLIENT_ID, // Your client id here
};

const userPool = new CognitoUserPool(poolData);

const signUp = (username, email, password) =>
  new Promise((resolve, reject) => {
    const userAttributes = [
      {
        Name: 'email',
        Value: email,
      },
    ];

    userPool.signUp(
      username,
      password,
      userAttributes,
      null,
      function (err, result) {
        if (err) {
          reject({
            success: false,
            errorMessage: err.name,
            data: null,
          });
          return;
        }
        resolve({
          success: true,
          errorMessage: null,
          data: {
            user: result.user.username,
          },
        });
      }
    );
  });

module.exports = {
  signUp,
};
