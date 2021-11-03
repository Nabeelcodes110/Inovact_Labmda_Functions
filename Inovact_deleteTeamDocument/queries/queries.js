    const  delete_team_documents = `
      mutation delete_team_documents($id: Int!) {
        delete_team_documents_by_pk(id: $id) {
          id
        }
      }
    `;
    
  



module.exports = {
 delete_team_documents
}


