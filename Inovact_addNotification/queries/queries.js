const getUserName = `query getUser($ids: [Int!]) {
  user(where: { id: { _in: $ids } }) {
    id
    first_name
    last_name
  }
}`;

module.exports = {
  getUserName,
};
