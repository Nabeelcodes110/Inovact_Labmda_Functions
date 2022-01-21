const getIdeas = `query getIdeas {
    idea {
      id
      title
      description
      user_id
      team_id
      idea_tags {
        hashtag {
          name
        }
      }
      idea_likes: idea_likes_aggregate {
        result: aggregate {
          count
        }
      }
      idea_comments {
        id
        created_at
        text
        updated_at
        user {
          id
          first_name
          last_name
        }
      }
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
  `;

const getIdea = `query getIdea($id: Int) {
    idea (where: { id: { _eq: $id }}) {
      id
      title
      description
      user_id
      team_id
      idea_tags {
        hashtag {
          name
        }
      }
      idea_likes: idea_likes_aggregate {
        result: aggregate {
          count
        }
      }
      idea_comments {
        id
        created_at
        text
        updated_at
        user {
          id
          first_name
          last_name
        }
      }
      created_at
      updated_at
    }
  }
  `;

module.exports = {
  getIdea,
  getIdeas,
};
