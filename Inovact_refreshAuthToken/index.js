const { refreshAuthToken } = require('./utils/cognito');

exports.handler = async (events, context, callback) => {
  const { email, refreshToken } = events;

  const result = await refreshAuthToken(email, refreshToken).catch(err => {
    return err;
  });

  callback(null, result);
};
