const { listUsers, linkUsers } = require('./utils/cognito');
const { getOfficialProviderName } = require('./utils/helpers');

exports.handler = async (event, context, callback) => {
  const users = await listUsers(
    event.userPoolId,
    event.request.userAttributes.email
  );

  // If traditional login prevent signup if user already exists
  if (
    event.triggerSource == 'PreSignUp_SignUp' ||
    event.triggerSource == 'PreSignUp_AdminCreateUser'
  ) {
    if (users && users.length > 0) {
      callback(
        'An external provider accounts already exists for this email address',
        null
      );
    } else {
      callback(null, event);
    }
  }
  // If social login link accounts if user already exists
  else if (event.triggerSource === 'PreSignUp_ExternalProvider') {
    if (users && users.length == 0) return callback(null, event); // No user found, continue with signup

    // Link User
    // @TODO - Make sure to use traditional user if exists
    const user = users[0];

    const sourceUser = {
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: event.userName.split('_')[1], // @TODO - Correct this for linkedIn
      ProviderName: getOfficialProviderName(event.userName.split('_')[0]),
    };

    const destinationUser = {
      ProviderAttributeValue: user.Username,
      ProviderName: 'Cognito',
    };

    const success = await linkUsers(
      event.userPoolId,
      sourceUser,
      destinationUser
    );

    if (!success) return callback('Failed to link user', null);

    callback(null, event);
  }
  // If not social or traditional login, prevent signup
  else {
    callback('Cannot signup with this provider', null);
  }
};
