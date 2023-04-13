const deleteUser = `mutation deleteUser($cognito_sub: String_comparison_exp) {
    delete_user_by_pk(where: { cognito_sub: $cognito_sub }){
        id
    }
}`;

module.exports = {
  deleteUser,
};
