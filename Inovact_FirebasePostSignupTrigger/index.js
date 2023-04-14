const firebase_functions = require('firebase-functions');
const { addUser, addUserVerbose } = require('./queries/mutations');
const { getUser } = require('./queries/queries');
const { query: Hasura } = require('./utils/hasura');

const post_signup_trigger = async (event, context, callback) => {
  const userAttributes = event.request.userAttributes;
  const email = userAttributes.email;
  const userName = event.userName;
  const cognitoSub = event.request.userAttributes.sub;
  const firstName = userAttributes['given_name'];
  const lastName = userAttributes['family_name'];
  const avatar = userAttributes['avatar'];

  let variables = {
    email,
    userName,
    cognitoSub,
    firstName,
    lastName,
    avatar,
  };

  firebase_functions.auth.user().onCreate(async variables => {
    if (userAttributes['cognito:user_status'] === 'EXTERNAL_PROVIDER') {
      const response = await Hasura(getUser, { email });
      if (!response.success) return callback('InternalServerError', null);
      if (response.result.data.user.length > 0) {
        // User already exists in Hasura
        return callback(null, event);
      }

      const response2 = await Hasura(addUserVerbose, variables);

      if (!response2.success)
        return callback(JSON.stringify(response2.errors), null);

      return callback(null, event);
    } else {
      const response = await Hasura(addUser, variables);

      if (!response.success)
        return callback(JSON.stringify(response.errors), null);

      return callback(null, event);
    }
  });
};
