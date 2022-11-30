const AWS = require('aws-sdk');
AWS.config.region = 'ap-south-1';

const identity = new AWS.CognitoIdentityServiceProvider();

const listUsers = async (userPoolId, email) => {
  const params = {
    UserPoolId: userPoolId,
    AttributesToGet: null,
    Filter: `email = "${email}"`,
    Limit: null,
  };

  try {
    const data = await identity.listUsers(params).promise();

    return data.Users;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const linkUsers = async (userPoolId, sourceUser, destinationUser) => {
  const params = {
    DestinationUser: {
      ProviderAttributeName: destinationUser.ProviderAttributeName,
      ProviderAttributeValue: destinationUser.ProviderAttributeValue,
      ProviderName: destinationUser.ProviderName,
    },
    SourceUser: {
      ProviderAttributeName: sourceUser.ProviderAttributeName,
      ProviderAttributeValue: sourceUser.ProviderAttributeValue,
      ProviderName: sourceUser.ProviderName,
    },
    UserPoolId: userPoolId,
  };

  try {
    const data = await identity.adminLinkProviderForUser(params).promise();

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  listUsers,
  linkUsers,
};
