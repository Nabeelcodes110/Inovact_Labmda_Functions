const axios = require('axios');
const { checkPhoneNumber } = require('../queries/queries');

//? This is a utility function for querying the postgresql database
async function query(query, variables = {}) {
  const result = await axios
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
    .then(response => {
      const responseData = response.data;

      if (responseData.data) {
        return {
          success: true,
          result: responseData,
        };
      } else {
        return {
          success: false,
          errors: responseData.errors,
        };
      }
    })
    .catch(err => {
      return {
        success: false,
        errors: err,
      };
    });

  return result;
}

async function checkUniquenessOfPhoneNumber(phoneNumber) {
  const response = await query(checkPhoneNumber, { phoneNumber });

  if (!response.success) {
    return false;
  } else {
    if (response.result.data.user_aggregate.aggregate.count != 0) {
      return false;
    } else {
      return true;
    }
  }
}

module.exports = { query };
