const acceptJoinRequest = `mutation acceptJoinRequest($user_id: Int, $team_id: Int, $request_id: Int) {
  delete_team_requests(where: {id: {_eq: $request_id}}) {
    affected_rows
  }
  insert_team_members(objects: [{
    user_id: $user_id,
    team_id: $team_id
  }]) {
    affected_rows
  }
}`;

module.exports = {
  acceptJoinRequest,
};
