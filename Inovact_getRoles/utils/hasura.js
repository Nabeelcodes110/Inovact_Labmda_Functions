const axios = require("axios");
async function query(query, variables = {}) {
  const result = await axios
    .post(
      process.env.HASURA_API,
      { query, variables },
      {
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    )
    .then((response) => {
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
    .catch((err) => {
      return {
        success: false,
        errors: err,
      };
    });

  return result;
}

module.exports = { query };
