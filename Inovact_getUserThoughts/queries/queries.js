const getUserThoughts = `query getUserThoughts($user_id: Int) {
  thoughts(where: {user_id: {_eq: $user_id}}) {
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
}`;

const getUserThoughtsWithCognitoSub = `query getUserThoughts($cognito_sub: String) {
  thoughts(where: { user: { cognito_sub: { _eq: $cognito_sub }}}) {
    id
    thought
    user_id
    
    thought_likes {
      user_id
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
}`;

module.exports = {
  getUserThoughts,
  getUserThoughtsWithCognitoSub,
};
