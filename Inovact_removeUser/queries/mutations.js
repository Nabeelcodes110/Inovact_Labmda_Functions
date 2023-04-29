const addUserCause = `mutation addUserCause($id : Int , $cause : String!){
    insert_user_causes(objects: [{id: $id, cause: $cause}]){
        returning{
            id
        }
    }
}`;

const deleteUser = `mutation deleteUser($id: Int!) {
    delete_user_by_pk( id: $id ){
        id
    }
}`;

module.exports = {
  addUserCause,
  deleteUser,
};
