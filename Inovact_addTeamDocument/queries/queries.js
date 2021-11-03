// Requires Cognito_sub
const getUserId = `query getUser($cognito_sub: String_comparison_exp) {
  user(where: { cognito_sub: $cognito_sub }) {
  id
 
  }
}
`;

const getTeamDocument = `query getTeamDocument($id: Int) {
  team_documents(where: {id: {_eq: $id}}) {
     id
      mime_type
      url
      name
      team{
           id
    name
    avatar
    looking_for_members
    looking_for_mentors
    team_role_requirements {
      role {
        id
        name
      }
      team_skill_requirements {
        skill {
          id
          name
        }
      }
    }
    team_invitations {
      invited_at
      user {
        id
        first_name
        last_name
      }
    }
    team_requests {
      user_id
      requested_on
    }
    team_members {
      joined_date
      admin
      user {
        id
        avatar
        first_name
        last_name
        role
      }
    }
    team_documents {
      id
      name
      mime_type
      uploaded_at
    }
    projects {
      title
      status
    }
      }
    
  
  }
}
`;

const getTeamUserId = `query getTeamUserId($team_id: Int) {
  team_members(where: {team_id: {_eq: $team_id}})  {
  user_id
 
  }
}
`;

module.exports = {
  getUserId,
 getTeamDocument,
 getTeamUserId
};
