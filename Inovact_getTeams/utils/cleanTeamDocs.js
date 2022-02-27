function cleanTeamDocs(teamDoc) {
  return {
    ...teamDoc,
    team_role_requirements: teamDoc.team_role_requirements.map(
      ele => ele.skill_name
    ),
  };
}

module.exports = {
  cleanTeamDocs,
};
