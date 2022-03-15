const { KMSDecrypter: decrypt } = require('./decrypt');

async function cleanMessageDocs(messageDocs) {
  let cleanedMessageDocs = [];

  for (let i = 0; i < messageDocs.length; i++) {
    const encryptedMessage = messageDocs[i].encrypted_message;

    // remove the leading \\x
    let data = encryptedMessage.replace('\\x', '');

    // Convert it to integer array
    data = data.match(/\w{2}/g);

    // Convert it to buffer
    data = Buffer.from(data);

    const decryptedMessage = await decrypt(data);

    cleanedMessageDocs.push({
      id: messageDoc.id,
      primary_user_id: messageDoc.primary_user_id,
      secondary_user_id: messageDoc.secondary_user_id,
      message: decryptedMessage,
      created_at: messageDoc.created_at,
    });
  }

  return cleanedMessageDocs;
}

module.exports = {
  cleanMessageDocs,
};
