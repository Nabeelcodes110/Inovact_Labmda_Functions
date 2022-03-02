const axios = require('axios');

exports.handler = (events, context, callback) => {
  const query = `
    query getUsers {
      user {
        id,
        user_name,
        bio,
        avatar,
        phone_number,
        email_id,
        designation,
        organization,
        organizational_role,
        university,
        graduation_year,
        journey_start_date,
        years_of_professional_experience,
        created_at,
        updated_at,
        first_name,
        last_name,
        role,
        cognito_sub,
        admin,
        profile_complete
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
      callback(null, res.data.data.user);
    })
    .catch(err => {
      callback(err);
    });
};
