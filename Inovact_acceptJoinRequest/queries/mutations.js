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

const deleteJoinRequest = `mutation deleteJoinReuqest($id: Int) {
  delete_team_requests(where: {id: { _eq: $id }}) {
    affected_rows
  }
}`;

module.exports = {
  addMembers,
  deleteJoinRequest,
};
