const { signIn, getCognitoUser } = require('./utils/cognito');
const { query: Hasura } = require('./utils/hasura');
const { getProfileComplete } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  // Check if already exists but email not verified
  const { hasRegistered, hasVerified } = await getCognitoUser(
    events.email
  ).catch(err => {
    return err;
  });

  if (!hasRegistered) {
    return callback(null, {
      success: false,
      errorCode: 'InvalidCredentialsException',
      errorMessage: 'Provided credentials pair do not match any record in db.',
    });
  } else if (hasRegistered && !hasVerified) {
    return callback(null, {
      success: false,
      errorCode: 'EmailNotVerifiedException',
      errorMessage: 'User has not verified his email',
    });
  }

  // @TODO Sanitize input
  let result = await signIn(events.email, events.password).catch(err => {
    return err;
  });

  if (!result.success) return callback(null, result);

  const response = await Hasura(getProfileComplete, { email: events.email });

  if (!response.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to fetch profile complete of user',
    });

  result.data['profile_complete'] =
    response.result.data.user[0].profile_complete;

  callback(null, result);
};
