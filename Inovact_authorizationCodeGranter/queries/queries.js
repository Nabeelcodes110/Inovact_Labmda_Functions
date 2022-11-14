const getProfileComplete = `query getProfileComplete($email: String) {
  user(where: { email_id: { _eq: $email }}) {
    profile_complete
  }
}`;

module.exports = {
  getProfileComplete,
};
