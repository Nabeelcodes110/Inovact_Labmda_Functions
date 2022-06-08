const { getPrivateMessages } = require('./queries/queries');
const { decryptMessages } = require('./utils/decryptMessages');
const { query: Hasura } = require('./utils/hasura');

exports.handler = async (events, context, callback) => {
  const { cognito_sub, user_id, timeStamp } = events;

  const variables = {
    cognito_sub,
    user_id,
    timeStamp: timeStamp || new Date().toISOString(),
  };

  const response1 = await Hasura(getPrivateMessages, variables);

  if (!response1.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to get latest private messages',
      data: null,
    });

  const decryptedMessages = await decryptMessages(
    response1.result.data.private_messages
  );

  return callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: decryptedMessages,
  });
};
