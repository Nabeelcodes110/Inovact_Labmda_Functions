const axios = require('axios')

exports.handler = (events, context, callback) => {
  const id = event.id;

  if (id) {
    const query = `
      mutation delete_idea($id: Int!) {
        delete_idea_by_pk(id: $id) {
          id
        }
      }
    `;

    const variables = {
      id
    }

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
      callback(null, res.data);
    })
    .catch((err) => {
      callback(err);
    });
  } else {
    callback({
      message: "Invalid or id not found"
    });
  }
}