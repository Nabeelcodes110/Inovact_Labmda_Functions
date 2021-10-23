const checkIfAdmin = `query checkIfAdmin($cognito_sub: String, $request_id: Int) {
  team_members(where: {user: {cognito_sub: {_eq: $cognito_sub}}, team: {team_requests: {id: {_eq: $request_id}}}}) {
    admin
  }
}
`;

const getRequestDetails = `query getRequestDetails($id: Int) {
  team_requests(where:  {id: {_eq: $id}}) {
    team_id
    user_id
  }
}`;

module.exports = {
  checkIfAdmin,
  getRequestDetails,
};
