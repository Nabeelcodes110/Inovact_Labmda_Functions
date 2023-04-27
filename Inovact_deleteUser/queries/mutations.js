const addUserCause = `mutation addUserCause($id : Int , $cause : String!){
    insert_user_causes(objects: [{id: $id, cause: $cause}]){
        returning{
            id
        }
    }
}`;

module.exports = {
  addUserCause,
};
