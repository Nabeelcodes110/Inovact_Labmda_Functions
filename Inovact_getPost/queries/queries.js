const getProjects = `query getProjects {
  project {
    id
    title
    description
    project_tags {
      hashtag {
        name
      }
    }
    project_likes {
      user_id
    }
    project_comments {
      id
      text
      user_id
    }
    project_mentions {
      user {
        id
        user_name
      }
    }
    project_documents {
      id
      name
      url
      uploaded_at
    }
    status
    team_id
    completed
    created_at
    updated_at
    user {
      id
      avatar
      first_name
      last_name
      role
    }
  }
}`;

const getProject = `query getProject($id: Int) {
  project(where: { id: { _eq: $id }}) {
    id
    title
    description
    project_tags {
      hashtag {
        name
      }
    }
    project_likes {
      user_id
    }
    project_comments {
      id
      text
      user_id
    }
    project_mentions {
      user {
        id
        user_name
      }
    }
    project_documents {
      id
      name
      url
      uploaded_at
    }
    status
    team_id
    completed
    created_at
    updated_at
    user {
      id
      avatar
      first_name
      last_name
      role
    }
    team {
      id
      name
      avatar
      looking_for_mentors
      team_members {
        user {
          id
          first_name
          last_name
          user_name
          role
          admin
        }
      }
    }
  }
}
`;

module.exports = {
  getProjects,
  getProject,
};
