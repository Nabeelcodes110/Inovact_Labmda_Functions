const { query: Hasura } = require('./utils/hasura');
const { addIdea, addTags, addDocuments } = require('./queries/mutations');
const { getUser, getIdea } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  // Find user id
  const cognito_sub = events.cognito_sub;
  const response1 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  // If failed to find user return error
  if (!response1.success) callback(null, response1.errors);
  if (response1.result.data.user.length == 0) callback('User not found');

  const ideaData = {
    description: events.description,
    title: events.title,
    user_id: response1.result.data.user[0].id,
    url: events.url,
  };

  const response2 = await Hasura(addIdea, ideaData);

  // If failed to insert project return error
  if (!response2.success) return callback(null, response2.errors);

  // Insert tags
  if (events.idea_tags.length) {
    const tags = events.idea_tags.map(tag_id => {
      return {
        tag_id,
        idea_id: response2.result.data.insert_idea.returning[0].id,
      };
    });

    const tagsData = {
      objects: tags,
    };

    // @TODO Fallback if tags fail to be inserted
    const response3 = await Hasura(addTags, tagsData);
  }

  // Insert Documents
  if (events.documents.length) {
    const documents = events.documents.map(document => {
      return {
        ...document,
        idea_id: response2.result.data.insert_idea.returning[0].id,
      };
    });

    const documentsData = {
      objects: documents,
    };

    // @TODO Fallback if documents fail to be inserted
    const response4 = await Hasura(addDocuments, documentsData);
  }

  // Fetch the project in final stage
  const variables = {
    id: response2.result.data.insert_idea.returning[0].id,
  };

  const response5 = await Hasura(getIdea, variables);

  if (!response5.success) callback(null, response2.errors);

  callback(null, response2.result);
};
