const { query: Hasura } = require('./utils/hasura');
const { addThought} = require('./queries/mutations');
const { getUser, getThought } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success) callback(null, response1.errors);
  if (response1.result.data.user.length == 0) callback('User not found');

  const thoughtData = {
    thought: events.thought,
    user_id: response1.result.data.user[0].id,
  };

  const response2 = await Hasura(addThought, thoughtData);

  // If failed to insert thought return error
  if (!response2.success) return callback(null, response2.errors);

  

   
  // Fetch the thought in final stage
  const variables = {
    id: response2.result.data.insert_thoughts.returning[0].id,
  };

  const response5 = await Hasura(getThought, variables);

  if (!response5.success) callback(null, response5.errors);

  callback(null, response5.result);
};
