const initiateConnection = `mutation initiateConnection($user1_id: Int, $user2_id: Int) {
  insert_connections(objects: [{
    user1: $user1_id,
    user2: $user2_id,
    initiated_by: $user1_id
  }]) {
    returning {
      user1
      user2
    }
  }
}`;

module.exports = {
  initiateConnection,
};
