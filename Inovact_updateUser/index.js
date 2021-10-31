const { updateUser } = require('./queries/mutations');
const { query: Hasura } = require('./utils/hasura');

exports.handler = async (events, context, callback) => {
  const cognito_sub = events.cognito_sub;

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
  if (events.role) variables['changes']['role'] = events.role;
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
  if (events.website) variables['changes']['website'] = events.website;

  const response = await Hasura(updateUser, variables);

  if (!response.success) return callback(null, response.errors);

  callback(null, response.result);
};
