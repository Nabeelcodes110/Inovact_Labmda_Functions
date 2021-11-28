const { query: Hasura } = require('./utils/hasura');
const cleanUserdoc = require('./utils/cleanUserDoc');
const { getUser, getUserById } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const id = events.id;
  const cognito_sub = events.cognito_sub;

  let query;
  let variables;

  if (id) {
    query = getUserById;

    variables = {
      id: {
        _eq: id,
      },
    };
  } else {
    query = getUser;

    variables = {
      cognito_sub: {
        _eq: cognito_sub,
      },
    };
  }

  const response = await Hasura(query, variables);

  if (!response.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to fetch user data',
    });

  const cleanedUserDoc = cleanUserdoc(response.result.data.user[0]);

  callback(null, cleanedUserDoc);
};
