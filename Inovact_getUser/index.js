const axios = require('axios');

exports.handler = (events, context, callback) => {
  const id = events.id;

  if (typeof id == 'string') {
    const query = `
      query getUser($id: Int_comparison_exp) {
        user(where: { id: $id }) {
          id,
          user_name,
          bio,
          avatar,
          phone_number,
          email_id,
          designation,
          organization,
          organizational_role,
          summary,
          university,
          graduation_year,
          journey_start_date,
          years_of_personal_experience
        }
      }
    `;

    const variables = {
      id: {
        _eq: id,
      },
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
        callback(null, res.data);
      })
      .catch(err => {
        callback(err);
      });
  } else {
    callback({
      statusCode: 400,
      message: 'Invalid or missing id',
    });
  }
};
