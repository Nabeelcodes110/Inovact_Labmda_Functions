const getRoles = `query getRoles($_role: String) {
    roles(
      where:{
        name:{
          _ilike:$_role
        }
      }
    ) {
      id,
      name,
    }
  }`;

module.exports = {
  getRoles,
};
