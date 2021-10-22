const getUserThoughts = `query getUserThoughts($user_id: Int) {
  thoughts(where: {user_id: {_eq: $user_id}}) {
    user_id
    thought
    id
    created_at
    updated_at
  }
}`;

const getUserThoughtsWithCognitoSub = `query getUserThoughts($cognito_sub: String) {
  thoughts(where: { user: { cognito_sub: { _eq: $cognito_sub }}}) {
    user_id
    thought
    id
    created_at
    updated_at
  }
}`;

module.exports = {
  getUserThoughts,
  getUserThoughtsWithCognitoSub,
};
