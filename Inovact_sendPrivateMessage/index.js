const { sendMessage } = require('./queries/mutations');
const { getConnectionDetails, getUserId } = require('./queries/queries');
const { query: Hasura } = require('./utils/hasura');
const { KMSEncrypter: encrypt } = require('./utils/encrypt');

exports.handler = async (events, context, callback) => {
  const { cognito_sub, user_id, message } = events;

  // Check if logged in user is connected to the recipient
  const variables = {
    cognito_sub,
    user_id,
  };

  const response1 = await Hasura(getConnectionDetails, variables);

  if (!response1.success)
    return callback(null, {
      success: false,
      errorCode: 'IntenalServerError',
      errorMessage: 'Failed to get connection details',
      data: null,
    });

  if (response1.result.data.connections_aggregate.aggregate.count === 0)
    return callback(null, {
      success: false,
      errorCode: 'UserNotConnected',
      errorMessage: 'User is not connected to the recipient',
      data: null,
    });

  const response2 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response2.success)
    return callback(null, {
      success: false,
      errorCode: 'IntenalServerError',
      errorMessage: 'Failed to get user id',
      data: null,
    });

  // Encrypt the message text
  const encryptedMessage = await encrypt(message);

  // Convert it to hex string
  const encryptedMessageHex = encryptedMessage.toString('hex');

  // Send the message
  const variables2 = {
    primary_user_id: response2.result.data.user[0].id,
    encrypted_message: encryptedMessageHex,
    secondary_user_id: user_id,
  };

  const response3 = await Hasura(sendMessage, variables2);

  if (!response3.success)
    return callback(null, {
      success: false,
      errorCode: 'IntenalServerError',
      errorMessage: 'Failed to send message',
      data: null,
    });

  return callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
