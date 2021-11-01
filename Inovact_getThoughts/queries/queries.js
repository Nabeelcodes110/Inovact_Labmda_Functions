const getThoughts = `query getThoughts {
    thoughts(limit:20, order_by: {created_at:desc}) {
      id
      thought
      user_id
      
      thought_likes {
        user {
          id
          first_name
          last_name
          role
          avatar
        }
      }
      thought_comments {
        id
        created_at
        updated_at
        user_id
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
        user_id
      }
      thought_likes {
        user {
          id
          first_name
          last_name
          role
          avatar
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
