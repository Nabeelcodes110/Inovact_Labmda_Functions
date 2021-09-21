const axios = require("axios");

exports.handler = (events, context, callback) => {
  const query = `
    mutation updateUser($id: Int_comparison_exp, $changes: user_set_input) {
      update_user(where: { id: $id }, _set: $changes) {
        returning {
          id
        }
      }
    }
  `;

    let variables = {
      "id": {
        "_eq": events.id
      },
      changes: {}
    };

    if (events.first_name) variables["changes"]["first_name"] = events.first_name;
    if (events.last_name) variables["changes"]["last_name"] = events.last_name;
    if (events.user_name) variables["changes"]["user_name"] = events.user_name;
    if (events.bio) variables["changes"]["bio"] = events.bio;
    if (events.avatar) variables["changes"]["avatar"] = events.avatar;
    if (events.phone_number) variables["changes"]["number"] = events.number;
    if (events.status) variables["changes"]["status"] = events.status;
    if (events.designation) variables["changes"]["designation"] = events.designation;
    if (events.organization) variables["changes"]["organization"] = events.organization;
    if (events.organizational_role)
        variables["changes"]["organizational_role"] = events.organizational_role;
    if (events.summary) variables["changes"]["summary"] = events.summary;
    if (events.university) variables["changes"]["university"] = events.university;
    if (events.graduation_year)
        variables["changes"]["graduation_year"] = events.graduation_year;
    if (events.journey_start_date)
        variables["changes"]["journey_start_date"] = events.journey_start_date;
    if (events.years_of_personal_experience)
        variables["changes"]["years_of_personal_experience"] =
            events.years_of_personal_experience;

    axios
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
        .then((res) => {
            callback(null, res.data);
        })
        .catch((err) => {
            callback(err);
        });
};