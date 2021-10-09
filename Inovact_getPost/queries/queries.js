const getProjects = `query getProjects {
  project {
    id,
    title,
    description,
    status,
    mentions,
    looking_for_roles,
    project_tags {
      hashtag {
        tag_name
      }
    }
    team_id,
    completed,
    created_at,
    updated_at
  }
}`;

module.exports = {
  getProjects,
};
