const { signIn, getCognitoUser } = require('./utils/cognito');

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
  const result = await signIn(events.email, events.password).catch(err => {
    return err;
  });

  callback(null, result);
};
