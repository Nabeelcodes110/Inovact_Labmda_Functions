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
    return callback('invalid article type provided');
  }

  if (!response.success) return callback(null, response.errors);

  callback(null, response.result);
};
