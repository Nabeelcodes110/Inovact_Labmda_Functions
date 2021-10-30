const getUser = `query getUser($email: String) {
  user(where: { email_id: { _eq: $email }}) {
    id
    user_name
    email_id
  }
}`;

module.exports = {
  getUser,
};
