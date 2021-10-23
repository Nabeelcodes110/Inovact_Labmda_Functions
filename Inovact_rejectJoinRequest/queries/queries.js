const checkIfAdmin = `query checkIfAdmin($cognito_sub: String, $request_id: Int) {
  team_members(where: {user: {cognito_sub: {_eq: $cognito_sub}}, team: {team_requests: {id: {_eq: $request_id}}}}) {
    admin
  }
}
`;

module.exports = {
  checkIfAdmin,
};
