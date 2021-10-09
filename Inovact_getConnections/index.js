const { query: Hasura } = require('./utils/hasura');
const { getUserConnections, getUserId } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const user_id = events.user_id;

  let variables = {
    user_id: {
      _eq: '',
    },
  };

  if (user_id) variables.user_id._eq = user_id;
  else {
    const cognito_sub = events.cognito_sub;
    const response1 = await Hasura(getUserId, {
      cognito_sub: { _eq: cognito_sub },
    });

    if (response1.success) {
      if (response1.result.data.user.length) {
        variables.user_id._eq = response1.result.data.user[0].id;
      } else {
        return callback('User not found');
      }
    } else {
      return callback(null, response1.errors);
    }
  }

  const response2 = await Hasura(getUserConnections, variables);

  if (response2.success) {
    callback(null, response2.result);
  } else {
    callback(null, response2.errors);
  }
};
