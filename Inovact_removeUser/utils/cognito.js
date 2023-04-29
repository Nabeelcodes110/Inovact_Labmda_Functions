var admin = require('firebase-admin');

console.log(process.env.HASURA_API);
firebaseConfiguration = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);
firebaseConfiguration['private_key'] = process.env.FIREBASE_PRIVATE_KEY.replace(
  /\\n/g,
  '\n'
);
var serviceAccount = firebaseConfiguration;

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
