const { signIn } = require('./utils/cognito');

exports.handler = async (events, context, callback) => {
  // @TODO Sanitize input
  const result = await signIn(events.email, events.password).catch(
    console.error
  );

  if (!result) return callback('Failed to signIn');

  callback(null, result);
};
