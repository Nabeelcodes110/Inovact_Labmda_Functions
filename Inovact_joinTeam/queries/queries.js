const possibleToJoinTeam = `query joinTeam($team_id: Int, $cognito_sub: String) {
  team(where: {id: {_eq: $team_id}}) {
    looking_for_members
	}
  team_members(where: { team_id: {_eq: $team_id}, user: {cognito_sub: {_eq: $cognito_sub}}}) {
    team_id
    user_id
  }
  team_invitations(where: {team_id: {_eq: $team_id},  user: {cognito_sub: {_eq: $cognito_sub}}}) {
    id
  }
  user(where: {cognito_sub: {_eq: $cognito_sub}}) {
    id
  }
}`;

module.exports = {
  possibleToJoinTeam,
};
