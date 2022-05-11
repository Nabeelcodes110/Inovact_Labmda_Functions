function cleanPostDoc(postDoc) {
  postDoc.project_likes = postDoc.project_likes.result.count;
  postDoc.has_liked = postDoc.has_liked.result.count == 1 ? true : false;

  if (postDoc.team_id) {
    if (postDoc.team.team_requests.length != 0) {
      postDoc.team.has_requested = true;
    } else {
      postDoc.team.has_requested = false;
    }

    delete postDoc.team.team_requests;
  }

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
