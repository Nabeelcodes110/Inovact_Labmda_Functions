const addTeamRequest = `mutation addTeamRequest($user_id: Int, $roleRequirementId: Int, $team_id: Int) {
  insert_team_requests(objects: [{ user_id: $user_id, team_id: $team_id, role_requirement_id: $roleRequirementId }]) {
    affected_rows
  }
}`;

module.exports = {
  addTeamRequest,
};
