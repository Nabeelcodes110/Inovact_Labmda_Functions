const getTags = `query getTags {
    hashtag {
      id,
      tag_name,
    }
  }`;

module.exports = {
  getTags,
};
