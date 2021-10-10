const axios = require("axios");

exports.handler = (event, context, callback) => {
  const query = `
  mutation($created_at: timestamptz!, $followed_on: timestamptz!, $follower_id: Int!, $leader_id: Int!, $status_id: Int!) {
    insert_follower(objects: {created_at: $created_at, followed_on: $followed_on, follower_id: $follower_id, leader_id: $leader_id, status_id: $status_id}) {
      returning {
        id
      }
    }
  }
  `
  let variables = {
    created_at: new Date(),
    followed_on: new Date(),
    follower_id: event.follower_id,
    leader_id: event.leader_id,
    status_id: event.status_id
  }

  axios.post(
    process.env.HASURA_ENDPOINT,
    {
      query,
      variables
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET
      },
    }
  ).then(res => {
    console.log(res.data)
    callback(null, res.data)
  }).catch(err => {
    console.log(err)
    callback(err)
  })
}