const jwt_decode = require('jwt-decode');
const { query: Hasura } = require('./utils/hasura');
const { authorize } = require('./utils/cognito');
const { getProfileComplete } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const code = typeof events.code == 'string' && events.code.length > 0 ? events.code : false;

  if (!code) {
    callback(null, {
      success: false,
      errorCode: 'InvalidRequest',
      errorMessage: 'Missing or invalid code',
    })
  }

  const authorization_result = await authorize(code);

  if (!authorization_result.success) {
    callback(null, authorization_result);
  }

  const decoded = jwt_decode(authorization_result.data.idToken);
  const email = decoded.email;

  const result = await Hasura(getProfileComplete, { email });

  if (!result.success) {
    callback(null, result);
  }

  if (result.result.data.user.length == 0) {
    callback(null, {
      success: false,
      errorCode: 'InvalidCredentialsException',
      errorMessage: 'Provided credentials pair do not match any record in db.',
    });
  }

  const profile_complete = result.result.data.user[0].profile_complete;

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: {
      idToken: authorization_result.data.idToken,
      refreshToken: authorization_result.data.refreshToken,
      profile_complete: profile_complete,
    },
  });
};
