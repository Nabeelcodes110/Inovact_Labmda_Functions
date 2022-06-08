const getPrivateMessages = `query getPrivateMessages($cognito_sub: String, $user_id: Int, $timeStamp: timestamptz) {
  private_messages(where: {
    _or: [
      {
        _and: [
          {primary_user_id: {_eq: $user_id}}, {user: {cognito_sub: {_eq: $cognito_sub}}}
        ]
      },
      {
        _and: [
          {secondary_user_id: {_eq: $user_id}}, {user: {cognito_sub: {_eq: $cognito_sub}}}
        ]
      }
    ],
    created_at: { _lte: $timeStamp}}, limit: 50, order_by: { created_at: asc }) {
    created_at
    encrypted_message
    id
    primary_user_id
    secondary_user_id
  }
}
`;

module.exports = {
  getPrivateMessages,
};
