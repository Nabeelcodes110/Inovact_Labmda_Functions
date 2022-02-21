const addPostComment = require('./helpers/addPostComment');
const addIdeaComment = require('./helpers/addIdeaComment');
const addThoughtComment = require('./helpers/addThoughtComment');
const { getUserId } = require('./queries/queries');
const { query: Hasura } = require('./utils/hasura');

exports.handler = async (events, context, callback) => {
  const { article_type, text, cognito_sub, article_id } = events;

  // Find user id
  const response1 = await Hasura(getUserId, {
    cognito_sub: { _eq: cognito_sub },
  });

  let response;

  if (article_type == 'post') {
    response = await addPostComment(
      text,
      response1.result.data.user[0].id,
      article_id
    );
  } else if (article_type == 'idea') {
    response = await addIdeaComment(
      text,
      response1.result.data.user[0].id,
      article_id
    );
  } else if (article_type == 'thought') {
    response = await addThoughtComment(
      text,
      response1.result.data.user[0].id,
      article_id
    );
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

  if (article_type == 'post') {
    callback(null, {
      success: true,
      errorCode: '',
      errorMessage: '',
      data: response.result.data.insert_project_comment.returning.map(doc => {
        return {
          user_id: doc.user_id,
          text: doc.text,
          created_at: doc.created_at,
          updated_at: doc.updated_at,
          id: doc.project_id,
        };
      })[0],
    });
  } else if (article_type == 'idea') {
    callback(null, {
      success: true,
      errorCode: '',
      errorMessage: '',
      data: response.result.data.insert_idea_comment.returning.map(doc => {
        return {
          id: doc.idea_id,
          user_id: doc.user_id,
          text: doc.text,
          created_at: doc.created_at,
          updated_at: doc.updated_at,
        };
      })[0],
    });
  } else {
    callback(null, {
      success: true,
      errorCode: '',
      errorMessage: '',
      data: response.result.data.insert_thought_comments.returning.map(doc => {
        return {
          user_id: doc.user_id,
          text: doc.text,
          created_at: doc.created_at,
          updated_at: doc.updated_at,
          id: doc.thought_id,
        };
      })[0],
    });
  }
};
