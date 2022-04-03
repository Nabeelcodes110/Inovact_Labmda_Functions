const { query: Hasura } = require('./utils/hasura');
const { getProjects, getProject, getConnections } = require('./queries/queries');
const cleanPostDoc = require('./utils/cleanPostDoc');

exports.handler = async (events, context, callback) => {
  const id = await events.id;

  const response = await Hasura(getConnections, { cognito_sub: events.cognito_sub });

  if (!response.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to find login user',
      data: null,
    });
  }

  const userId = response.result.data.user[0].id;

  const connections = response.result.data.connections.map(doc => {
    if (doc.user1 === userId) {
      return doc.user2;
    } else {
      return doc.user1;
    }
  });

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
    
    if (response1.result.data.project.length === 0) {
      return callback(null, {
        success: false,
        errorCode: 'NotFound',
        errorMessage: 'Project not found',
        data: null,
      });
    }

    const cleanedPosts = response1.result.data.project.map(doc => {
      doc = cleanPostDoc(doc);
      doc.has_connected = connections.includes(doc.user.id);
      return doc;
    });

    callback(null, cleanedPosts[0]);
  } else {
    const variables = {
      cognito_sub: events.cognito_sub,
    };

    const response = await Hasura(getProjects, variables);

    if (response.success) {
      const cleanedPosts = response.result.data.project.map(doc => {
        doc = cleanPostDoc(doc);
        doc.has_connected = connections.includes(doc.user.id);
        return doc;
      });

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
