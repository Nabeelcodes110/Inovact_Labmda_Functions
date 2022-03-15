const { getLatestPrivateMessages } = require('./queries/queries');
const { cleanMessageDocs } = require('./utils/cleanMessageDocs');
const { query: Hasura } = require('./utils/hasura');

exports.handler = async (events, context, callback) => {
  const { cognito_sub, user_id, limit } = events;

  let l = parseInt(limit);
  l = isNaN(l) ? 0 : l;

  const variables = {
    cognito_sub,
    user_id,
    limit: l > 0 && l < 20 ? l : 20,
  };

  const response1 = await Hasura(getLatestPrivateMessages, variables);
  console.log(response1.errors);
  console.log(variables);
  if (!response1.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to get latest private messages',
      data: null,
    });

  const cleanedMessageDocs = await cleanMessageDocs(
    response1.result.data.private_messages
  );

  return callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: cleanedMessageDocs,
  });
};
