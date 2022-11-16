const AWS = require('aws-sdk');
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
const hasher = require("./hasher");

// Inovact-App-Client-2
const CLIENT_ID_2 = process.env.CLIENT_ID_2;
const CLIENT_SECRET_2 = process.env.CLIENT_SECRET_2;

const refreshAuthToken = (userName, refreshToken, clientId) => {
  const params = {
    AuthFlow: "REFRESH_TOKEN",
    ClientId: clientId,
    AuthParameters: {
      'REFRESH_TOKEN': refreshToken,
      'SECRET_HASH': clientId == CLIENT_ID_2 ? hasher(clientId, CLIENT_SECRET_2, userName) : null,
    },
    UserPoolId: process.env.USER_POOL_ID,
  };

  return new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.adminInitiateAuth(params, function(err, data) {
      if (err) {
        console.log(err);
        reject({
          success: false,
          errorCode: err.code,
          errorMessage: err.message,
        });
      } else {
        resolve({
          success: true,
          errorCode: "",
          errorMessage: "",
          data: {
            idToken: data.AuthenticationResult.IdToken
          },
        });
      }
    });
  });
}

module.exports = {
  refreshAuthToken,
};
