const acceptConnection = `mutation acceptConnection($user1: Int, $user2: Int) {
  update_connections(_set: { status: "connected"}, where: { user1: { _eq: $user1 }, user2: { _eq: $user2 }}) {
    returning {
      status
    }
  }
}`;

module.exports = {
  acceptConnection,
};
