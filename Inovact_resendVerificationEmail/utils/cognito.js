const AWS = require('aws-sdk');

AWS.config.region = process.env.REGION;

const identity = new AWS.CognitoIdentityServiceProvider();

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
          userName: null,
        });
      } else {
        const emailVerifiedAttribute = Users[0].Attributes.find(
          e => e.Name == 'email_verified'
        );

        if (!emailVerifiedAttribute) {
          resolve({
            userName: Users[0].Username,
            hasRegistered: false,
            hasVerified: false,
          });
        }

        if (emailVerifiedAttribute.Value == 'true') {
          resolve({
            userName: Users[0].Username,
            hasRegistered: true,
            hasVerified: true,
          });
        } else {
          resolve({
            userName: Users[0].Username,
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

const resendConfirmationEmail = userName => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: userName,
  };

  return identity.resendConfirmationCode(params).promise();
};

module.exports = {
  getCognitoUser,
  resendConfirmationEmail,
};
