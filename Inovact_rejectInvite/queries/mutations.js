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

const deleteInvitation = `mutation deleteInvitation($id: Int) {
  delete_team_invitations(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`;

module.exports = {
  deleteInvitation,
};
