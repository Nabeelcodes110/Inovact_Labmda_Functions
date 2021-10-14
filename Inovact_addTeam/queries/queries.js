const getUsersFromEmailId = `
query getUsersFromEmailId($emails: [String!]) {
  user(where: {email_id: {_in: $emails}}) {
    id
    email_id
  }
}
`;

module.exports = {
  getUsersFromEmailId,
};
