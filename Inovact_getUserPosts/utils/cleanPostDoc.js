function cleanPostDoc(postDoc) {
  postDoc.project_likes = postDoc.project_likes.result.count;

  return {
    ...postDoc,
    project_tags: postDoc.project_tags.map(post_tag => {
      return {
        name: post_tag.hashtag.name,
      };
    }),
  };
}

module.exports = cleanPostDoc;
