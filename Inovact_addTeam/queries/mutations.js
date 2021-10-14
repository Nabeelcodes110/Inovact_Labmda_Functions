const addTeam = `mutation addTeam($name: String, $description: String, $looking_for_members: Boolean, $looking_for_mentor: Boolean, $avatar: String) {
  insert_team(objects: [{
    name: $name,
    description: $description,
    looking_for_members: $looking_for_members,
    looking_for_mentors: $looking_for_mentor,
    avatar: $avatar
  }]) {
    returning {
      id
    }
  }
}
`;

const addInvitations = `mutation addInvitations($objects: [team_invitations_insert_input!]!) {
  insert_team_invitations(objects: $objects) {
    returning {
      id
    }
  }
}
`;

const addRoles = `mutation addRoles($objects: [team_role_requirements_insert_input!]!) {
  insert_team_role_requirements(objects: $objects) {
    returning {
      id
    }
  }
}
`;

module.exports = {
  addTeam,
  addInvitations,
  addRoles,
};
