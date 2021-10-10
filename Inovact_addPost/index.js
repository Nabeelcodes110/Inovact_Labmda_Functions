const {
  addProject,
  addMentions,
  addTags,
  addDocuments,
} = require('./queries/mutations');
const { getUser, getProject } = require('./queries/queries');
const { query: Hasura } = require('./utils/hasura');

exports.handler = async (events, context, callback) => {
  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success) return callback(null, response1.errors);
  if (response1.result.data.user.length == 0) return callback('User not found');

  // Insert project
  const projectData = {
    description: events.description,
    title: events.title,
    user_id: response1.result.data.user[0].id,
    status: events.status,
  };

  const response2 = await Hasura(addProject, projectData);

  // If failed to insert project return error
  if (!response2.success) return callback(null, response2.errors);

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
    const tags = events.project_tags.map(tag_id => {
      return {
        tag_id,
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
        ...document,
        project_id: response2.result.data.insert_project.returning[0].id,
      };
    });

    const documentsData = {
      objects: documents,
    };

    // @TODO Fallback if documents fail to be inserted
    const response6 = await Hasura(addDocuments, documentsData);
  }

  // Fetch the project in final stage
  const variables = {
    id: response2.result.data.insert_project.returning[0].id,
  };

  const response7 = await Hasura(getProject, variables);

  if (!response7.success) return callback(null, response7.errors);

  callback(null, response7.result);
};
