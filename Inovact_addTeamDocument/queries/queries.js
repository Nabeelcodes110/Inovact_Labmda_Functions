const checkIfAdmin = `query checkIfAdmin($cognito_sub: String, $team_id: Int) {
  team_members(where: {user: {cognito_sub: {_eq: $cognito_sub}}, team: {id: {_eq: $team_id}}}) {
    admin
  }
}`;

module.exports = {
  checkIfAdmin,
};
