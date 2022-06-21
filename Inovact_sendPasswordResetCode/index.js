const { sendCode } = require('./utils/cognito');

exports.handler = async (event, context, callback) => {
  const { email } = event;

  const success = await sendCode(email).catch(err => {
    callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to send password reset code',
      data: null,
    });
  });

  if (success) {
    return callback(null, {
      success: true,
      errorCode: '',
      errorMessage: '',
      data: null,
    });
  } else {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Success, but code not sent!',
      data: null,
    });
  }
};
