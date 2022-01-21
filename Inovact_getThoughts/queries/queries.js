const getThoughts = `query getThoughts {
    thoughts(limit:20, order_by: {created_at:desc}) {
      id
      thought
      user_id
      thought_likes: thought_likes_aggregate  {
        result: aggregate {
          count
        }
      }
      thought_comments {
        id
        created_at
        updated_at
        user {
          id
          first_name
          last_name
        }
        text
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

const getThought = `query getThought($id: Int) {
  thoughts (where: { id: { _eq: $id }}) {
    id
    thought
    user_id
    thought_comments {
      id
      created_at
      updated_at
      user {
        id
        first_name
        last_name
      }
      text
    }
    thought_likes: thought_likes_aggregate  {
      result: aggregate {
        count
      }
    }
    created_at
    updated_at
  }
}
  `;

module.exports = {
  getThoughts,
  getThought,
};
