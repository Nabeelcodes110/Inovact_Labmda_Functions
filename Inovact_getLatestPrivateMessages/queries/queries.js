const getLatestPrivateMessages = `query getLatestPrivateMessages($cognito_sub: String, $user_id: Int, $limit: Int) {
  private_messages(where: {_or: [{_and: [{primary_user_id: {_eq: $user_id}}, {user: {cognito_sub: {_eq: $cognito_sub}}}]}, {_and: [{secondary_user_id: {_eq: $user_id}}, {user: {cognito_sub: {_eq: $cognito_sub}}}]}]}, limit: $limit) {
    created_at
    encrypted_message
    id
    primary_user_id
    secondary_user_id
  }
}
`;

module.exports = {
  getLatestPrivateMessages,
};
