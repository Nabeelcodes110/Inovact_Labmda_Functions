function cleanUserdoc(userDoc) {
  return {
    ...userDoc,
    user_interests: userDoc.user_interests.map(user_interest => {
      return {
        id: user_interest.area_of_interest.id,
        interest: user_interest.area_of_interest.interest,
      };
    }),
  };
}

module.exports = cleanUserdoc;
