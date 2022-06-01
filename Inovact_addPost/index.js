const {
  addProject,
  addMentions,
  addTags,
  addDocuments,
  addRolesRequired,
  addSkillsRequired,
} = require('./queries/mutations');
const { getUser, getProject } = require('./queries/queries');
const { query: Hasura } = require('./utils/hasura');
const createDefaultTeam = require('./utils/createDefaultTeam');

exports.handler = async (events, context, callback) => {
  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find login user',
      data: null,
    });

  // Insert project
  const projectData = {
    description: events.description,
    title: events.title,
    user_id: response1.result.data.user[0].id,
    status: events.status,
    completed: events.completed,
    link: events.link,
  };

  let teamCreated;

  // Create a default team
  if (events.team_id) {
    projectData.team_id = events.team_id;
  } else if (events.looking_for_members || events.looking_for_mentors) {
    teamCreated = await createDefaultTeam(
      response1.result.data.user[0].id,
      events.team_name ? events.team_name : events.title + ' team',
      events.looking_for_mentors,
      events.looking_for_members,
      events.team_on_inovact
    );

    if (!teamCreated.success) {
      return callback(null, teamCreated);
    }

    projectData.team_id = teamCreated.team_id;
  } else {
    projectData.team_id = null;
  }

  const response2 = await Hasura(addProject, projectData);

  // If failed to insert project return error
  if (!response2.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    });

  // Insert roles required and skills required
  role_if: if (events.roles_required.length > 0 && projectData.team_id) {
    const roles_data = events.roles_required.map(ele => {
      return {
        team_id: projectData.team_id,
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

  // Insert mentions
  if (events.mentions.length) {
    const mentions = events.mentions.map(user_id => {
      return {
        user_id,
        project_id: response2.result.data.insert_project.returning[0].id,
      };
    });

    const mentionsData = {
      objects: mentions,
    };

    // @TODO Fallback if mentions fail to be inserted
    const response3 = await Hasura(addMentions, mentionsData);
  }

  // Insert tags
  if (events.project_tags.length) {
    const tags = events.project_tags.map(tag_name => {
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
        project_id: response2.result.data.insert_project.returning[0].id,
      };
    });

    const tagsData = {
      objects: tags,
    };

    // @TODO Fallback if tags fail to be inserted
    const response4 = await Hasura(addTags, tagsData);
  }

  // Insert Documents
  if (events.documents.length) {
    const documents = events.documents.map(document => {
      return {
        name: document.name,
        url: document.url,
        project_id: response2.result.data.insert_project.returning[0].id,
      };
    });

    const documentsData = {
      objects: documents,
    };

    // @TODO Fallback if documents fail to be inserted
    const response6 = await Hasura(addDocuments, documentsData);
  }

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
