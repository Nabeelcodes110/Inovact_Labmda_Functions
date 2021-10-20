const { signUp } = require('./utils/cognito');

exports.handler = async (events, context, callback) => {
  const result = await signUp(
    events.username,
    events.email,
    events.password
  ).catch(err => {
    return err;
  });

  if (!result.success) return callback(result.name, result.message);

  callback(null, result);
};
