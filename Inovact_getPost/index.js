const { query: Hasura } = require('./utils/hasura');
const { getProjects, getProject } = require('./queries/queries');
const cleanPostDoc = require('./utils/cleanPostDoc');

exports.handler = async (events, context, callback) => {
  const id = await events.id;

  if (id) {
    const variables = {
      id,
    };

    const response1 = await Hasura(getProject, variables);

    if (!response1.success) return callback(null, response1.errors);

    const cleanedPosts = response1.result.data.project.map(cleanPostDoc);

    callback(null, cleanedPosts);
  } else {
    const response = await Hasura(getProjects);

    const cleanedPosts = response.result.data.project.map(cleanPostDoc);

    if (response.success) {
      callback(null, cleanedPosts);
    } else {
      callback(null, response.errors);
    }
  }
};
