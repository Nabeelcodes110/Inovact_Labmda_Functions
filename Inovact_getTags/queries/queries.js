const getTags = `query getTags($_tag: String) {
    hashtag(
      where:{
        name:{
          _ilike:$_tag
        }
      }
    ) {
      id,
      tag_name,
    }
  }`;

module.exports = {
  getTags,
};
