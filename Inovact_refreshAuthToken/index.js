const { refreshAuthToken } = require('./utils/cognito');

exports.handler = async (events, context, callback) => {
  const { userName, refreshToken, clientId } = events;

  const result = await refreshAuthToken(userName, refreshToken, clientId).catch(err => {
    return err;
  });

  callback(null, result);
};
