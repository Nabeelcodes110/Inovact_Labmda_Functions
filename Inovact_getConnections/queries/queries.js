const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

const getUserConnections = `query getMyConnections($user_id: Int_comparison_exp) {
  connections(where: {_or: {user1: $user_id, user2: $user_id}}) {
    user1
    user2
    created_at
    formed_at
    initiated_by
    status
  }
}`;

module.exports = {
  getUserConnections,
  getUserId,
};
