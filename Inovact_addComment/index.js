const addPostComment = require('./helpers/addPostComment');
const addIdeaComment = require('./helpers/addIdeaComment');
const addThoughtComment = require('./helpers/addThoughtComment');
const { getUserId } = require('./queries/queries');
const notify = require('./utils/notify');
const { query: Hasura } = require('./utils/hasura');

exports.handler = async (events, context, callback) => {
  const { text, cognito_sub, article_id } = events;
  let { article_type } = events;

  // Find user id
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  let response, entity_type_id, doc, notifier_id;

  if (article_type == 'post') {
    article_type = 'project';
    entity_type_id = 2;
    response = await addPostComment(
      text,
      response1.result.data.user[0].id,
      article_id
    );
    doc = response.result.data.insert_project_comment.returning[0];
    notifier_id = doc.project.user_id;
  } else if (article_type == 'idea') {
    entity_type_id = 7;
    response = await addIdeaComment(
      text,
      response1.result.data.user[0].id,
      article_id
    );
    doc = response.result.data.insert_idea_comment.returning[0];
    notifier_id = doc.idea.user_id;
  } else if (article_type == 'thought') {
    article_type = 'thoughts';
    entity_type_id = 12;
    response = await addThoughtComment(
      text,
      response1.result.data.user[0].id,
      article_id
    );
    doc = response.result.data.insert_thought_comments.returning[0];
    notifier_id = doc.thought.user_id;
  } else {
    return callback(null, {
      success: false,
      errorCode: 'INVALID_ARTICLE_TYPE',
      errorMessage: 'Invalid article type provided',
      data: null,
    });
  }

  if (!response.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });

  if (article_type == 'project') {
    callback(null, {
      success: true,
      errorCode: '',
      errorMessage: '',
      data: {
        user_id: doc.user_id,
        text: doc.text,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        id: doc.project_id,
      },
    });
  } else if (article_type == 'idea') {
    callback(null, {
      success: true,
      errorCode: '',
      errorMessage: '',
      data: {
        id: doc.idea_id,
        user_id: doc.user_id,
        text: doc.text,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
      },
    });
  } else {
    callback(null, {
      success: true,
      errorCode: '',
      errorMessage: '',
      data: {
        user_id: doc.user_id,
        text: doc.text,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        id: doc.thought_id,
      },
    });
  }

  // Notify the user
  await notify(entity_type_id, article_id, response1.result.data.user[0].id, [
    notifier_id,
  ]).catch(console.log);
};
