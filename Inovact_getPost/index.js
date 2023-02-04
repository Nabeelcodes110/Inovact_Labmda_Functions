const { query: Hasura } = require('./utils/hasura');
const { getProjects, getProject, getConnections } = require('./queries/queries');
const cleanPostDoc = require('./utils/cleanPostDoc');

exports.handler = async (events, context, callback) => {
  const { id, cognito_sub } = events;

  const response = await Hasura(getConnections, { cognito_sub });

  if (!response.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });
  }

  const userId = response.result.data.user[0].id;

  const connections = {};
  response.result.data.connections.forEach((doc) => {
    if (doc.user1 === userId) {
      connections[doc.user2] = doc.status;
    } else {
      connections[doc.user1] = doc.status;
    }
  });

  if (id) {
    const variables = {
      id,
      cognito_sub,
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

    const cleanedPosts = response1.result.data.project.map((doc) => {
      doc = cleanPostDoc(doc);
      doc.connections_status = connections[doc.user.id] ? connections[doc.user.id] : 'not connected';
      return doc;
    });

    callback(null, cleanedPosts[0]);
  } else {
    const variables = {
      cognito_sub,
    };

    const response1 = await Hasura(getProjects, variables);

    if (!response1.success)
      return callback(nul, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response1.errors),
        data: null,
      });

    const cleanedPosts = response1.result.data.project.map((doc) => {
      doc = cleanPostDoc(doc);
      doc.connections_status = connections[doc.user.id] ? connections[doc.user.id] : 'not connected';
      return doc;
    });

    callback(null, cleanedPosts);
  }
};
