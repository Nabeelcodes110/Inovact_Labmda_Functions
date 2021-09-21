const axios = require("axios");
exports.handler = (event, context, callback) => {
  const query = `query getProjects {
  project {
    id,    

  }
}`;
  axios
    .post(
      process.env.HASURA_API,

      { query, variables: {} },
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
};
