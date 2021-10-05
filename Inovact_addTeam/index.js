const axios = require('axios');

const validateMembers = members => {
  for (const member of members) {
    if (typeof member.email != 'string' || typeof member.role != 'string') {
      return false;
    }
  }

  return true;
};

exports.handler = async (event, context, callback) => {
  const name =
    typeof event.name == 'string' && event.name.length != 0
      ? event.name
      : false;
  const description =
    typeof event.description == 'string' && event.description.length != 0
      ? event.description
      : false;
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

  if (
    name &&
    description &&
    typeof looking_for_mentor == 'boolean' &&
    typeof looking_for_members == 'boolean' &&
    tags &&
    validateMembers(members)
  ) {
    const query = `
      mutation addTeam($name: String, $description: String, $looking_for_members: Boolean, $looking_for_mentor: Boolean) {
        insert_team(objects: [{
          name: $name,
          description: $description,
          looking_for_members: $looking_for_members,
          looking_for_mentors: $looking_for_mentor
        }]) {
          returning {
            id
          }
        }
      }
    `;
    const variables = {
      name,
      description,
      looking_for_members,
      looking_for_mentor,
    };

    const res1 = await axios
      .post(
        process.env.HASURA_API,
        { query, variables },
        {
          headers: {
            'content-type': 'application/json',
            'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
          },
        }
      )
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.log(err);
        return false;
      });

    if (res1) {
      const team = res1.data.insert_team.returning[0];

      // Query to fetch user ids of givel email ids
      const query = `
          query getUsersFromEmailId($emails: [String!]) {
            user(where: {email_id: {_in: $emails}}) {
              id
              email_id
            }
          }
        `;

      const variables = {
        emails: members.map(member => member.email),
      };

      const res2 = await axios
        .post(
          process.env.HASURA_API,
          { query, variables },
          {
            headers: {
              'content-type': 'application/json',
              'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
            },
          }
        )
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log(err);
        });

      if (res2) {
        const { user: users } = res2.data;

        let userIds = [];
        for (const user of users) {
          userIds.push(user.id);
        }

        const sentEmailIds = users.map(user => user.email_id);

        const failedEmailds = members.filter(member => {
          if (sentEmailIds.indexOf(member.email) == -1) {
            return true;
          } else {
            return false;
          }
        });

        // Queyr to add to invitations table
        const query = `
            mutation addInvitations($objects: [team_invitations_insert_input!]!) {
              insert_team_invitations(objects: $objects) {
                returning {
                  id
                }
              }
            }
          `;

        let objects = [];

        for (const user of users) {
          objects.push({
            user_id: user.id,
            team_id: team.id,
          });
        }

        const variables = {
          objects,
        };

        const res3 = await axios
          .post(
            process.env.HASURA_API,
            { query, variables },
            {
              headers: {
                'content-type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
              },
            }
          )
          .then(res => {
            return res.data;
          })
          .catch(err => {
            console.log(err);
          });

        if (res3) {
          callback(null, {
            message: 'Succesfully created team',
          });
        } else {
          callback('Internal Error: Failed to invite members');
        }
      } else {
        callback('Internal Error: Failed to send invitations to team members');
      }
    } else {
      callback('Internal Error: Failed to create a new team');
    }
  } else {
    callback('Bad Request: Invalid or missing required parameters');
  }
};
