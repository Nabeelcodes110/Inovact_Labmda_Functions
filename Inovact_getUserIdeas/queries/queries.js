const getUserIdeas = `query getIdeas($user_id: Int) {
  idea(where: {user_id: {_eq: $user_id}}) {
    id
    title
    description
    user_id
    idea_tags {
      hashtag {
        name
      }
    }
    idea_likes {
      user_id
    }
    idea_comments {
      id
      created_at
      text
      updated_at
      user_id
    }
    idea_documents {
      id
      name
      url
      uploaded_at
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

const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
    id
  }
}
`;

module.exports = {
  getUserIdeas,
  getUserId,
};
