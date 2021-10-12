const axios = require('axios');
exports.handler = (event, context, callback) => {
  const query = `query getIdea {
    idea {
      id
      title
      description
      user_id
      idea_tags {
        hashtag {
          name
        }
      }
      idea_likes {
        user_id
      }
      idea_comments {
        id
        created_at
        text
        updated_at
        user_id
      }
      idea_documents {
        id
        name
        url
        uploaded_at
      }
      created_at
      updated_at
    }
  }
  `;
  axios
    .post(
      process.env.HASURA_API,

      { query, variables: {} },
      {
        headers: {
          'content-type': 'application/json',
          'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
        },
      }
    )
    .then(res => {
      console.log(res.data);
      callback(null, res.data);
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });
};
