const admin = require('firebase-admin');
admin.initializeApp();

const deleteUser = async cognito_sub => {
  admin
    .auth()
    .deleteUser(cognito_sub)
    .then(() => {
      return true;
    })
    .catch(error => {
      return false;
    });
};

module.exports = { deleteUser };
