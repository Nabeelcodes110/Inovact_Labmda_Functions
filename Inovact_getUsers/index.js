const axios = require("axios");

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
        summary,
        university,
        graduation_year,
        journey_start_date,
        years_of_personal_experience
      }
    }
  `;

    axios
        .post(
            process.env.HASURA_API,
            { query, variables: {} },
            {
                headers: {
                    "content-type": "application/json",
                    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
                },
            }
        )
        .then((res) => {
            callback(null, res.data);
        })
        .catch((err) => {
            callback(err);
        });
};
