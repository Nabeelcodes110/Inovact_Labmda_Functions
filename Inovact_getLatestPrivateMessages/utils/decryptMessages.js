const { KMSDecrypter: decrypt } = require('./decrypt');

async function decryptMessages(messageDocs) {
  let decryptedMessages = [];

  for (let i = 0; i < messageDocs.length; i++) {
    const encryptedMessage = messageDocs[i].encrypted_message;

    // remove the leading \\x
    const data = Buffer.from(encryptedMessage.slice(2), 'hex');

    const decryptedMessage = await decrypt(data);

    decryptedMessages.push({
      id: messageDocs[i].id,
      primary_user_id: messageDocs[i].primary_user_id,
      secondary_user_id: messageDocs[i].secondary_user_id,
      message: decryptedMessage,
      created_at: messageDocs[i].created_at,
    });
  }

  return decryptedMessages;
}

module.exports = {
  decryptMessages,
};
