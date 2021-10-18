const { query: Hasura } = require('./utils/hasura');
const {
  addTeam,
  addInvitations,
  addRoles,
  addMembers,
  addTeamTags,
  addSkills,
} = require('./queries/mutations');
const { getUsersFromEmailId, getUserId } = require('./queries/queries');

const validateMembers = members => {
  for (const member of members) {
    if (typeof member.email != 'string' || typeof member.role != 'number') {
      return false;
    }
  }

  return true;
};

const validateRoles = roles => {
  for (const role of roles) {
    if (!role.id || !role.skills instanceof Array) return false;

    for (const skill of role.skills) {
      if (!skill.id || !skill.proficiency) return false;
    }
  }

  return true;
};

exports.handler = async (event, context, callback) => {
  const name =
    typeof event.name == 'string' && event.name.length != 0
      ? event.name
      : false;
  const avatar =
    typeof event.avatar == 'string' && event.avatar.length != 0
      ? event.avatar
      : '';
  const looking_for_mentor =
    typeof event.looking_for_mentor == 'boolean'
      ? event.looking_for_mentor
      : null;
  const looking_for_members =
    typeof event.looking_for_members == 'boolean'
      ? event.looking_for_members
      : null;
  const tags = event.tags instanceof Array ? event.tags : false;
  const members = event.members instanceof Array ? event.members : false;
  const roles = event.roles instanceof Array ? event.roles : false;

  if (
    name &&
    typeof looking_for_mentor == 'boolean' &&
    typeof looking_for_members == 'boolean' &&
    tags &&
    validateMembers(members) &&
    validateRoles(roles)
  ) {
    // Save team to DB
    const teamData = {
      name,
      looking_for_members,
      looking_for_mentor,
      avatar,
    };

    const response1 = await Hasura(addTeam, teamData);

    if (!response1.success) callback(null, response1.errors);

    const team = response1.result.data.insert_team.returning[0];

    // Add current user as a member with admin: true
    // Find user id
    const cognito_sub = event.cognito_sub;
    const response5 = await Hasura(getUserId, {
      cognito_sub: { _eq: cognito_sub },
    });

    if (!response5.success) return callback(null, response5.errors);

    const memberObjects = {
      objects: [
        {
          user_id: response5.result.data.user[0].id,
          team_id: team.id,
          admin: true,
        },
      ],
    };

    const response6 = await Hasura(addMembers, memberObjects);

    if (!response6.success) return callback(null, response6.errors);

    // Fetch user ids of existing users
    // Invite all the possible people in the members array
    if (members.length) {
      const emails = {
        emails: members.map(member => member.email),
      };

      const response2 = await Hasura(getUsersFromEmailId, emails);

      if (!response2.success) callback(null, response2.errors);

      // Extract users from response
      const { user: users } = response2.result.data;

      // Extract user ids from users
      let userIds = [];
      for (const user of users) {
        userIds.push(user.id);
      }

      // Emails of existing users
      const sentEmailIds = users.map(user => user.email_id);

      // Emails of non existing users
      const failedEmailds = members.filter(member => {
        if (sentEmailIds.indexOf(member.email) == -1) {
          return true;
        } else {
          return false;
        }
      });

      // Invite existing users to team
      let objects = [];

      for (const user of users) {
        objects.push({
          user_id: user.id,
          team_id: team.id,
        });
      }

      const invitations = {
        objects,
      };

      const response3 = await Hasura(addInvitations, invitations);

      if (!response3.success) return callback(null, response3.erorrs);
    }

    // Save roles required for the team
    role_if: if (roles.length) {
      const roleObjects = {
        objects: roles.map(role => {
          return {
            role_id: role.id,
            team_id: team.id,
          };
        }),
      };

      // @TODO Handle failure of roles insertion
      const response4 = await Hasura(addRoles, roleObjects);

      // Dont try to save skills if failed to save roles
      if (!response4.success) break role_if;

      // Save the skills required for each role
      let objects = [];
      for (const i in roles) {
        for (const j in roles[i].skills) {
          objects.push({
            role_requirement_id:
              response4.result.data.insert_team_role_requirements.returning[i]
                .id,
            skill_id: roles[i].skills[j].id,
            proficiency: roles[i].skills[j].proficiency,
          });
        }
      }

      const skillObjects = {
        objects,
      };

      // @TODO Handle failue of skills insertion
      const response5 = await Hasura(addSkills, skillObjects);
    }

    // Save the tags associated with the team
    if (tags.length) {
      const tagsData = {
        objects: tags.map(tag_id => {
          return {
            tag_id,
            team_id: team.id,
          };
        }),
      };

      // @TODO Fallback if tags fail to be inserted
      const response4 = await Hasura(addTeamTags, tagsData);
    }

    callback(null, { success: true });

    // @TODO Handle emails of non existing users
    // @TODO Send invites over mail using emails of existing users
  } else {
    callback('Bad Request: Invalid or missing required parameters');
  }
};
