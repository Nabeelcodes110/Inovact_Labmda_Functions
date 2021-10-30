const updateTeam = `mutation updateTeam($avatar: String, $team_id: Int) {
  update_team(where: {id: {_eq: $team_id}}, _set: {avatar: $avatar}) {
    affected_rows
  }
}
`;

module.exports = {
  updateTeam,
};
