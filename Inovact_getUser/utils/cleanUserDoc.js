function cleanUserdoc(userDoc) {
  return {
    ...userDoc,
    user_skills: userDoc.user_skills.map(user_skill => {
      return {
        id: user_skill.skill.id,
        name: user_skill.skill.name,
      };
    }),
    user_interests: userDoc.user_interests.map(user_interest => {
      return {
        id: user_interest.area_of_interest.id,
        interest: user_interest.area_of_interest.interest,
      };
    }),
  };
}

module.exports = cleanUserdoc;
