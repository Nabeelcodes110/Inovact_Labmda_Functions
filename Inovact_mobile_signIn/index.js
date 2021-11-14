const { signIn } = require('./utils/cognito');

exports.handler = async (events, context, callback) => {
  // @TODO Sanitize input
  const result = await signIn(events.email, events.password).catch(err => {
    return err;
  });

  callback(null, result);
};
