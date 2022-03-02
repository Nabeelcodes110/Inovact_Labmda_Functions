function cleanTeamDocs(teamDoc) {
  teamDoc.team_role_requirements = teamDoc.team_role_requirements.map(
    team_role_requirement => {
      team_role_requirement.team_skill_requirements =
        team_role_requirement.team_skill_requirements.map(
          ele => ele.skill_name
        );
      return team_role_requirement;
    }
  );

  teamDoc.team_tags = teamDoc.team_tags.map(team_tag => {
    return {
      name: team_tag.hashtag.name,
    };
  });

  teamDoc.admin_id = teamDoc.team_members.filter(doc => doc.admin)[0].user.id;

  return teamDoc;
}

module.exports = {
  cleanTeamDocs,
};
