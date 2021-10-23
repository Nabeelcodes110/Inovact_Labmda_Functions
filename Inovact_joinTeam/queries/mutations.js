const addTeamRequest = `mutation addTeamRequest($user_id: Int, $team_id: Int) {
  insert_team_requests(objects: [{ user_id: $user_id, team_id: $team_id }]) {
    affected_rows
  }
}`;

module.exports = {
  addTeamRequest,
};
