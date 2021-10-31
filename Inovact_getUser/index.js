const axios = require('axios');

exports.handler = (events, context, callback) => {
  const id = events.id;
  const cognito_sub = events.cognito_sub;

  let query;
  let variables;

  if (id) {
    query = `
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
      website
      profile_complete
      user_skills {
        skill {
          id
          name
        }
      }
      user_interests {
        area_of_interest {
          id
          interest
        }
      }
      }
    }
  `;

    variables = {
      id: {
        _eq: id,
      },
    };
  } else {
    query = `query getUser($cognito_sub: String_comparison_exp) {
        user(where: { cognito_sub: $cognito_sub }) {
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
        website,
        profile_complete
        user_skills {
          skill {
            id
            name
          }
        }
        user_interests {
          area_of_interest {
            id
            interest
          }
        }
        }
      }
    `;

    variables = {
      cognito_sub: {
        _eq: cognito_sub,
      },
    };
  }

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
};
