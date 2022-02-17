const {
  updateUser,
  addUserSkills,
  addUserInterests,
} = require('./queries/mutations');
const { getUser } = require('./queries/queries');
const cleanUserdoc = require('./utils/cleanUserDoc');
const {
  query: Hasura,
  checkUniquenessOfPhoneNumber,
} = require('./utils/hasura');

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
  if (events.phone_number) {
    const unique = await checkUniquenessOfPhoneNumber(events.phone_number);

    if (!unique) {
      return callback(null, {
        success: false,
        errorCode: 'PhoneNumberUniquenessException',
        errorMessage: 'This phone number is already in use',
      });
    }

    variables['changes']['phone_number'] = events.phone_number;
  }
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
  else variable['change']['website'] = '';

  const response1 = await Hasura(updateUser, variables);

  if (!response1.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed due to unknows reason',
    });

  // Insert skills
  if (events.user_skills instanceof Array) {
    const user_skills_with_user_id = events.user_skills.map(ele => {
      return {
        ...ele,
        user_id: response1.result.data.update_user.returning[0].id,
      };
    });

    const variables = {
      objects: user_skills_with_user_id,
    };

    await Hasura(addUserSkills, variables);
  }

  // Insert interests
  if (events.user_interests instanceof Array) {
    const user_interests_with_user_id = events.user_interests.map(ele => {
      return {
        interest_id: ele.id,
        user_id: response1.result.data.update_user.returning[0].id,
      };
    });

    const variables = {
      objects: user_interests_with_user_id,
    };

    await Hasura(addUserInterests, variables);
  }

  const response2 = await Hasura(getUser, {
    cognito_sub: { _eq: cognito_sub },
  });

  if (!response2.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage:
        'Updated user succesfully but failed to fetch updated user document.',
    });
  }

  const cleanedUserDoc = cleanUserdoc(response2.result.data.user[0]);

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: cleanedUserDoc,
  });
};
