function cleanIdeaDoc(ideaDoc) {
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
