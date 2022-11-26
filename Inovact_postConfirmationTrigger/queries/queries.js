const getUser = `query getUser($email: String) {
  user(where: { email_id: { _eq: $email } }) {
    id
    avatar
    first_name
    last_name
  }
}`;

module.exports = {
  getUser,
};
