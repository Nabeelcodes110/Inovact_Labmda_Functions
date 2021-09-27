const axios = require('axios');
exports.handler = (event, context, callback) => {
  const query = `mutation add_idea($caption: String!,$description: String!,$title:String!,$user_id:Int,$url:String!) {
  insert_idea(objects: [{
    caption: $caption
    description: $description
    user_id: $user_id
		title:$title
		url:$url
  }]) {
    returning {
      id
      created_at
      updated_at
    }
  }
}`;

  let variables = {
    caption: event.caption,
    description: event.description,
    title: event.title,
    user_id: event.user_id,
    url: event.url,
  };
  axios
    .post(
      process.env.HASURA_API,

      { query, variables },
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
  // callback(null, event);
};
