const cleanIdeaDoc = require('./utils/cleanIdeaDoc');
const { query: Hasura } = require('./utils/hasura');
const { getIdea, getIdeas, getConnections } = require('./queries/queries');

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

    const response1 = await Hasura(getIdea, variables);

    if (!response1.success)
      return callback(null, {
        success: false,
        errorCode: 'InternalServerError',
        errorMessage: JSON.stringify(response1.errors),
        data: null,
      });

    const cleanedIdeas = response1.result.data.idea.map(doc => {
      doc = cleanIdeaDoc(doc);
      doc.has_connected = connections.includes(doc.user.id);
      return doc;
    });

    callback(null, cleanedIdeas[0]);
  } else {
    const variables = {
      cognito_sub: events.cognito_sub,
    };

    const response = await Hasura(getIdeas, variables);

    if (response.success) {
      const cleanedIdeas = response.result.data.idea.map(doc => {
        doc = cleanIdeaDoc(doc);
        doc.has_connected = connections.includes(doc.user.id);
        return doc;
      });

      callback(null, cleanedIdeas);
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
