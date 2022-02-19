const { query: Hasura } = require('./utils/hasura');
const { getProjects, getProject } = require('./queries/queries');
const cleanPostDoc = require('./utils/cleanPostDoc');

exports.handler = async (events, context, callback) => {
  const id = await events.id;

  if (id) {
    const variables = {
      id,
      cognito_sub: events.cognito_sub,
    };

    const response1 = await Hasura(getProject, variables);

    if (!response1.success)
      return callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response1.errors),
        data: null,
      });

    const cleanedPosts = response1.result.data.project.map(cleanPostDoc);

    callback(null, cleanedPosts[0]);
  } else {
    const variables = {
      cognito_sub: events.cognito_sub,
    };

    const response = await Hasura(getProjects, variables);

    if (response.success) {
      const cleanedPosts = response.result.data.project.map(cleanPostDoc);

      callback(null, cleanedPosts);
    } else {
      callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response.errors),
        data: null,
      });
    }
  }
};
