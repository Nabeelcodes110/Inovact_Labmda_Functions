function cleanIdeaDoc(ideaDoc) {
  ideaDoc.idea_likes = ideaDoc.idea_likes.result.count;
  ideaDoc.has_liked = ideaDoc.has_liked.result.count == 1 ? true : false;

  if (ideaDoc.team_id) {
    if (ideaDoc.team.team_requests.length != 0) {
      ideaDoc.team.has_requested = true;
    } else {
      ideaDoc.team.has_requested = false;
    }

    delete ideaDoc.team.team_requests;
  }

  return {
    ...ideaDoc,
    idea_tags: ideaDoc.idea_tags.map(idea_tag => {
      return {
        name: idea_tag.hashtag.name,
      };
    }),
  };
}

module.exports = cleanIdeaDoc;
