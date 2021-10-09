const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const { addIdea } = require('./queries/mutations');
const { getUser } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (response1.success) {
    if (response1.result.data.user.length) {
      const data = {
        description: events.description,
        title: events.title,
        user_id: response1.result.data.user[0].id,
        url: events.url,
      };

      const response2 = await Hasura(addIdea, data);

      if (response2.success) {
        callback(null, response2.result);
      } else {
        callback(null, response2.errors);
      }
    } else {
      callback('User not found');
    }
  } else {
    callback(null, response1.errors);
  }
};
