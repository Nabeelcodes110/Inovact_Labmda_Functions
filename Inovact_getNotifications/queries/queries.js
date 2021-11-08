const userNotifications = `query getUserNotification($cognito_sub: String, $yesterday: timestamptz) {
  user(where: {cognito_sub: {_eq: $cognito_sub}}) {
    connectionsByUser2 {
      created_at
      status
      user1
      user {
        id
        first_name
        last_name
        role
        avatar
      }
      user2
    }
    team_invitations {
      id
      user_id
      invited_at
      team {
        id
        name
        team_members(where: {admin: {_eq: true}}) {
          admin
          user {
            id
            first_name
            last_name
            role
            avatar
          }
        }
      }
    }
    projects(where: {project_likes: {liked_at: {_gt: $yesterday}}}) {
      id
      title
      project_likes {
        liked_at
        user {
          id
          first_name
          last_name
          role
          avatar
        }
      }
    }
    ideas(where: {idea_likes: {liked_at: {_gt: $yesterday}}}) {
      id
      title
      idea_likes {
        liked_at
        user {
          id
          first_name
          last_name
          role
          avatar
        }
      }
    }
    thoughts(where: {thought_likes: {liked_at: {_gt: $yesterday}}}) {
      id
      thought
      thought_likes {
        liked_at
        user {
          id
          first_name
          last_name
          role
          avatar
        }
      }
    }
  }
}
`;

module.exports = {
  userNotifications,
};
