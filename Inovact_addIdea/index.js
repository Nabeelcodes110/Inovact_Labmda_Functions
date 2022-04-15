const { query: Hasura } = require('./utils/hasura');
const {
  addIdea,
  addTags,
  addSkillsRequired,
  addRolesRequired,
} = require('./queries/mutations');
const { getUser, getIdea } = require('./queries/queries');
const createDefaultTeam = require('./utils/createDefaultTeam');
const cleanIdeaDoc = require('./utils/cleanIdeaDoc');

exports.handler = async (events, context, callback) => {
  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success)
    callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find login user',
    });

  let ideaData = {
    description: events.description,
    title: events.title,
    user_id: response1.result.data.user[0].id,
  };

  let teamCreated;

  // Create a default team
  if (events.team_id) {
    ideaData.team_id = events.team_id;
  } else if (events.looking_for_members == 'true') {
    teamCreated = await createDefaultTeam(
      response1.result.data.user[0].id,
      events.title,
      events.looking_for_mentors,
      events.looking_for_members,
      ''
    );

    if (!teamCreated.success) {
      return callback(null, teamCreated);
    }

    ideaData.team_id = teamCreated.team_id;
  } else {
    ideaData.team_id = null;
  }

  const response2 = await Hasura(addIdea, ideaData);

  // If failed to insert idea return error
  if (!response2.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to save idea',
    });

  role_if: if (ideaData.team_id && events.roles_required.length > 0) {
    const roles_data = events.roles_required.map(ele => {
      return {
        team_id: ideaData.team_id,
        role_name: ele.role_name,
      };
    });

    const response1 = await Hasura(addRolesRequired, { objects: roles_data });

    if (!response1.success) break role_if;

    let skills_data = [];

    for (const i in events.roles_required) {
      for (const skill of events.roles_required[i].skills_required) {
        skills_data.push({
          role_requirement_id:
            response1.result.data.insert_team_role_requirements.returning[i].id,
          skill_name: skill,
        });
      }
    }

    const response2 = await Hasura(addSkillsRequired, { objects: skills_data });
  }

  // Insert tags
  if (events.idea_tags.length) {
    const tags = events.idea_tags.map(tag_name => {
      return {
        hashtag: {
          data: {
            name: tag_name.toLowerCase(),
          },
          on_conflict: {
            constraint: 'hashtag_tag_name_key',
            update_columns: 'name',
          },
        },
        idea_id: response2.result.data.insert_idea.returning[0].id,
      };
    });

    const tagsData = {
      objects: tags,
    };

    // @TODO Fallback if tags fail to be inserted
    const response3 = await Hasura(addTags, tagsData);
  }

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
