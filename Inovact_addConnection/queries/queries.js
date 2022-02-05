const getUserId = `query getUser($cognito_sub: String_comparison_exp, $id: Int_comparison_exp) {
  user(where: { _or: [ { cognito_sub: $cognito_sub }, { id: $id } ]}) {
    id
  }
}
`;

const getConnection = `query getConnection($user1: Int, $user2: Int) {
  connections(where: { _or: [
    {
      _and: [{user1: { _eq: $user1 }}, {user2: { _eq: $user2 }}]
    },
    {
      _and: [{user1: { _eq: $user2 }}, {user2: { _eq: $user1 }}]
    }
  ]}) {
    status
  }
}`;

module.exports = {
  getConnection,
  getUserId,
};
