const { getUserId } = require('./queries/queries');
const { initiateConnection } = require('./queries/mutations');
const { query: Hasura } = require('./utils/hasura');

exports.handler = async (events, context, callback) => {
  const user_id = events.user_id;

  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (response1.success) {
    if (response1.result.data.user[0].id == user_id)
      return callback('Stop being a gay');

    const variables = {
      user1_id: response1.result.data.user[0].id,
      user2_id: user_id,
    };

    const response2 = await Hasura(initiateConnection, variables);

    if (response2.success) {
      callback(null);
    } else {
      callback(null, response2.errors);
    }
  } else {
    callback(null, response1.errors);
  }
};
