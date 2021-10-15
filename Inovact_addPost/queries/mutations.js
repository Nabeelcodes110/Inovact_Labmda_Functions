const addProject = `mutation add_project($description: String!, $title: String!, $user_id: Int, $status: String) {
  insert_project(objects: [{title: $title, description: $description, user_id: $user_id, status: $status}]) {
    returning {
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
  }
}
`;

const addMentions = `mutation addMentions($objects: [project_mentions_insert_input!]!) {
  insert_project_mentions(objects: $objects) {
    returning {
      project_id
      user_id
    }
  }
}`;

const addTags = `mutation addTags($objects: [project_tag_insert_input!]!) {
  insert_project_tag(objects: $objects) {
    returning {
      project_id
      tag_id
    }
  }
}`;

const addDocuments = `mutation addDocuments($objects: [project_documents_insert_input!]!) {
  insert_project_documents(objects: $objects) {
    returning {
      project_id
    }
  }
}`;

module.exports = {
  addProject,
  addMentions,
  addTags,
  addDocuments,
};
