const addTeam = `mutation addTeam($name: String, $looking_for_members: Boolean, $looking_for_mentor: Boolean, $avatar: String) {
  insert_team(objects: [{
    name: $name,
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

const addMembers = `mutation addMembers($objects: [team_members_insert_input!]!) {
  insert_team_members(objects: $objects) {
    returning {
      user_id
      team_id
      admin
      joined_date
    }
  }
}`;

module.exports = {
  addTeam,
  addInvitations,
  addRoles,
  addMembers,
};
