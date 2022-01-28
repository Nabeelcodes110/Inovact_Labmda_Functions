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
      team {
        id
        looking_for_members
        looking_for_mentors
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
      team {
        id
        looking_for_members
        looking_for_mentors
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
