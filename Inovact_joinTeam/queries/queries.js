const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

const checkTeamMember = `query checkTeamMember($team_id: Int, $cognito_sub: String) {
  team_members(where: { team_id: {_eq: $team_id}, user: { cognito_sub: {_eq: $cognito_sub}}}) {
    team_id
    user_id
  }
}`;

module.exports = {
  getUserId,
  checkTeamMember,
};
