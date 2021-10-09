const axios = require('axios');

exports.handler = (events, context, callback) => {
  const cognito_sub = events.cognito_sub;

  const query = `
    mutation updateUser($cognito_sub: String_comparison_exp, $changes: user_set_input) {
      update_user(where: { cognito_sub: $cognito_sub }, _set: $changes) {
        returning {
          id
        }
      }
    }
  `;

  let variables = {
    cognito_sub: {
      _eq: cognito_sub,
    },
    changes: {},
  };

  if (events.first_name) variables['changes']['first_name'] = events.first_name;
  if (events.last_name) variables['changes']['last_name'] = events.last_name;
  if (events.bio) variables['changes']['bio'] = events.bio;
  if (events.avatar) variables['changes']['avatar'] = events.avatar;
  if (events.phone_number)
    variables['changes']['phone_number'] = events.phone_number;
  if (events.role) variables['change']['role'] = events.role;
  if (events.designation)
    variables['changes']['designation'] = events.designation;
  if (events.organization)
    variables['changes']['organization'] = events.organization;
  if (events.organizational_role)
    variables['changes']['organizational_role'] = events.organizational_role;
  if (events.university) variables['changes']['university'] = events.university;
  if (events.graduation_year)
    variables['changes']['graduation_year'] = events.graduation_year;
  if (events.journey_start_date)
    variables['changes']['journey_start_date'] = events.journey_start_date;
  if (events.years_of_professional_experience)
    variables['changes']['years_of_professional_experience'] =
      events.years_of_professional_experience;
  if (events.degree) variables['changes']['degree'] = events.degree;
  if (events.profile_complete)
    variables['changes']['profile_complete'] = events.profile_complete;

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
