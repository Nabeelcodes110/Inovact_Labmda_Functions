var admin = require('firebase-admin');

console.log(process.env.HASURA_API);
var serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://inovact-social-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const deleteUser = async uid => {
  admin
    .auth()
    .deleteUser(uid)
    .then(() => {
      return true;
    })
    .catch(error => {
      return false;
    });
};

module.exports = { deleteUser };
