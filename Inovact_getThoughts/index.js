const cleanThoughtDoc = require('./utils/cleanThoughtDoc');
const { query: Hasura } = require('./utils/hasura');
const { getThought, getThoughts: getThoughtsQuery, getConnections } = require('./queries/queries');

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

    const response1 = await Hasura(getThought, variables);

    if (!response1.success)
      return callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response1.errors),
        data: null,
      });

    if (response1.result.data.thoughts.length === 0) {
      return callback(null, {
        success: false,
        errorCode: 'NotFound',
        errorMessage: 'Thought not found',
        data: null,
      });
    }
    const cleanedThoughts = response1.result.data.thoughts.map((doc) => {
      doc = cleanThoughtDoc(doc);
      doc.connections_status = connections[doc.user.id] ? connections[doc.user.id] : 'not connected';
      return doc;
    });

    callback(null, cleanedThoughts[0]);
  } else {
    const variables = {
      cognito_sub,
    };

    const response1 = await Hasura(getThoughtsQuery, variables);

    if (!response1.success) {
      return callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response1.errors),
        data: null,
      });
    }

    const cleanedThoughts = response1.result.data.thoughts.map((doc) => {
      doc = cleanThoughtDoc(doc);
      doc.connections_status = connections[doc.user.id] ? connections[doc.user.id] : 'not connected';
      return doc;
    });

    callback(null, cleanedThoughts);
  }
};
