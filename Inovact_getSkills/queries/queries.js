const getSkills = `query getSkills($_skill: String!) {
    skills(
      where:{
        name:{
          _ilike:$_skill
        }
      }
    ){
      id,
      name,
    }
  }`;

module.exports = {
  getSkills,
};
