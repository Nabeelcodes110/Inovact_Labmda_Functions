const axios = require("axios");
exports.handler = (event, context, callback) => {
  const query = `mutation add_project($caption: String!,$description: String!,$title:String!,$mentions:String!,$user_id:Int) {
  insert_project(objects: [{
    caption: $caption
    description: $description
    user_id: $user_id
		title:$title
		mentions:$mentions
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
    mentions: event.mentions,
    user_id: event.user_id,
  };
  axios
    .post(
      process.env.HASURA_API,

      { query, variables },
      {
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    )
    .then((res) => {
      console.log(res.data);
      callback(null, res.data);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
  // callback(null, event);
};
