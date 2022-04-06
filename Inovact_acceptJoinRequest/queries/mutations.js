const acceptJoinRequest = `mutation acceptJoinRequest($user_id: Int, $team_id: Int, $request_id: Int, $role: String, $role_requirement_id: Int) {
  delete_team_requests(where: {id: {_eq: $request_id}}) {
    affected_rows
  }
  insert_team_members(objects: [{
    user_id: $user_id,
    team_id: $team_id,
    role: $role
  }]) {
    affected_rows
  }
  delete_team_role_requirements(where: {id: {_eq: $role_requirement_id}}) {
    affected_rows
  }
}`;

module.exports = {
  acceptJoinRequest,
};
