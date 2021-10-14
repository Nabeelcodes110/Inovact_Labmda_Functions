const getMyTeams = `query getMyTeams($user_id: Int) {
  team_members(where: {_and: [{user_id: {_eq: $user_id}}, {admin: {_eq: true}}]}) {
    team {
      name
      description
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

const getTeam = `query getMyTeams($team_id: Int) {
  team(where: {id: {_eq: $team_id}}) {
    name
    description
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
  }
}
`;

module.exports = {
  getMyTeams,
  getUserId,
  getTeam,
};
