const crypto = require('crypto');

function hasher(clientId, clientSecret, email) {
  const hash = crypto.createHmac('sha256', clientSecret);

  hash.update(`${email}${clientId}`);
  
  return hash.digest('base64');
}

module.exports = hasher;