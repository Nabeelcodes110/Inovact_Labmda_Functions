const { query: Hasura } = require('./utils/hasura');
const { getUserConnections, getUserId } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  const user_id = parseInt(response1.result.data.user[0].id);

  const variables = {
    user_id,
  };

  const response2 = await Hasura(getUserConnections, variables);

  const connections = response2.result.data.connections.map(doc => {
    let obj = {
      status: doc.status,
    };

    if (doc.user1 == user_id) {
      obj.user = doc.userByUser2;
    } else {
      obj.user = doc.user;
    }

    return obj;
  });

  if (response2.success) {
    callback(null, connections);
  } else {
    callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });
  }
};
