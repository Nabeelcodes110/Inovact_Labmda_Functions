const { getCognitoUser, resendConfirmationEmail } = require('./utils/cognito');

exports.handler = async (event, context, callback) => {
  const { hasRegistered, hasVerified } = await getCognitoUser(
    event.email
  ).catch(err => {
    return err;
  });

  if (!hasRegistered) {
    callback(null, {
      success: false,
      errorCode: 'EmailNotFoundException',
      errorMessage: 'No user found with the given email',
    });
  } else if (hasVerified) {
    callback(null, {
      success: false,
      errorCode: 'EmailVerifiedException',
      errorMessage: 'This email has already been verified',
    });
  } else {
    const success = await resendConfirmationEmail(event.email).catch(err => {
      // console.log(err)
      return false;
    });

    if (success) {
      callback(null, {
        success: true,
        errorCode: '',
        errorMessage: '',
      });
    } else {
      callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: 'Failed to send verification email',
      });
    }
  }
};
