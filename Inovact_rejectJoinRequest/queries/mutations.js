const deleteJoinRequest = `mutation deleteJoinReuqest($id: Int) {
  delete_team_requests(where: {id: { _eq: $id }}) {
    affected_rows
  }
}`;

module.exports = {
  deleteJoinRequest,
};
