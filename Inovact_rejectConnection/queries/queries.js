const getPendingConnection = `query getConnection($user1: Int_comparison_exp, $user2: Int_comparison_exp) {
  connections(where: { _or: [
    { _and: [{user1: { _eq: $user1 }}, {user2: { _eq: $user1 }2}] },
    { _and: [{user1: { _eq: $user1 }}, {user2: { _eq: $user1 }}] }
  ], status: { _eq: "pending"}}) {
    user1
    user2
    status
  }
}
`;

const deleteConnection = `mutation rejectConnection($user1: Int, $user2: Int) {
  delete_connections(where: { user1: { _eq: $user1 }, user2: { _eq: $user1 }}) {
    returning {
      status
    }
  }
}`;

module.exports = {
  getPendingConnection,
  deleteConnection,
};
