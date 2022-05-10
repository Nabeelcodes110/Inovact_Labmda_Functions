const { query: Hasura } = require('./utils/hasura');
const { getUserId } = require('./queries/queries');
const { addUserInterests } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const cognito_sub = events.cognito_sub;

  const response1 = await Hasura(getUserId, { cognito_sub });

  if (!response1.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
      data: null,
    });
  }

  const interests = events.interests.map(interest => {
    return {
      area_of_interest: {
        data: {
          interest: interest.toLowerCase(),
        },
        on_conflict: {
          constraint: 'area_of_interests_interest_key',
          update_columns: 'interest',
        },
      },
      user_id: response1.result.data.user[0].id,
    };
  });

  const variables = {
    objects: interests,
  };

  const response = await Hasura(addUserInterests, variables);

  if (!response.success) {
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });
  }

  callback(null, {
    success: true,
    errorCode: '',
    errorMessage: '',
    data: null,
  });
};
