const { resetPassword } = require('./utils/cognito');

exports.handler = async (event, context, callback) => {
  const { email, password, code } = event;

  const success = await resetPassword(email, password, code).catch(err => {
    callback(null, {
      success: false,
      errorCode: err.code,
      errorMessage: err.message,
      data: null,
    });
  });

  return callback(null, {
    success,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
