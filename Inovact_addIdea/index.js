const { query: Hasura } = require('./utils/hasura');
const { addIdea, addTags, addDocuments } = require('./queries/mutations');
const { getUser, getIdea } = require('./queries/queries');
const createDefaultTeam = require('./utils/createDefaultTeam');

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

  if (!events.team_id) {
    const teamCreated = await createDefaultTeam(
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
    ideaData.team_id = events.team_id;
  }

  const response2 = await Hasura(addIdea, ideaData);

  // If failed to insert project return error
  if (!response2.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to save idea',
    });

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
  if (events.documents && events.documents.length) {
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

  if (!response5.success)
    callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Saved project successfully but could not retieve it.',
    });

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: response5.result.data.idea[0],
  });
};
