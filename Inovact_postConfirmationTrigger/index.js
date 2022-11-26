const { addUser, addUserVerbose } = require('./queries/mutations');
const { getUser } = require('./queries/queries');
const { query: Hasura } = require('./utils/hasura');

exports.handler = async (event, context, callback) => {
  console.log(event);
  const userAttributes = event.request.userAttributes;

  const email = userAttributes.email;
  const userName = event.userName;
  const cognitoSub = event.request.userAttributes.sub;

  let variables = {
    email,
    userName,
    cognitoSub,
  };

  if (userAttributes['cognito:user_status'] === 'EXTERNAL_PROVIDER') {
    const response = await Hasura(getUser, { email });

    if (!response.success) return callback('InternalServerError', null);

    if (response.result.data.user.length > 0) {
      // User already exists in Hasura
      return callback(null, event);
    }

    variables['firstName'] = userAttributes['given_name'];
    variables['lastName'] = userAttributes['family_name'];
    variables['avatar'] = userAttributes['picture'];

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
};
