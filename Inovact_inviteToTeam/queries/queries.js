const checkTeamMember = `query checkTeamMember($team_id: Int, $user_id: Int) {
  team_members(where: { team_id: {_eq: $team_id}, user_id: { _eq: $user_id }}) {
    team_id
    user_id
  }
}`;

const checkIfAdmin = `query checkIfAdmin($cognito_sub: String, $team_id: Int) {
  team_members(where: {user: {cognito_sub: {_eq: $cognito_sub}}, team_id: {_eq: $team_id}}) {
    admin
  }
}
`;

const checkIfAlreadyInvited = `query checkIfAlreadyInvited($team_id: Int, $user_id: Int) {
  team_invitations(where: {team_id: {_eq: $team_id}, user_id: {_eq: $user_id}}) {
    id
  }
}
`;

module.exports = {
  checkIfAlreadyInvited,
  checkTeamMember,
  checkIfAdmin,
};
