const aws = require('aws-sdk');
const axios = require('axios');

const ses = new aws.SES();

exports.handler = (event, context, callback) => {
  if (event.request.userAttributes.email) {
    const email_id = event.request.userAttributes.email;
    const user_name = email_id;
    const cognito_sub = event.request.userAttributes.sub;

    const query = `
          mutation add_user($user_name: String, $email_id: String, $cognito_sub: String) {
            insert_user(objects: [{user_name: $user_name, email_id: $email_id, cognito_sub: $cognito_sub}]) {
              returning {
                id
              }
            }
          }
        `;

    const variables = {
      email_id,
      user_name,
      cognito_sub,
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
        console.log(res.status, res.data, res);
        callback(null, event);
      })
      .catch(err => {
        console.log(err);
        callback(err, event);
      });
  }
};
