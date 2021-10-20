const axios = require('axios');
const { query: Hasura } = require('./utils/hasura');
const { deleteTeam } = require('./queries/mutations');

exports.handler = async (events, context, callback) => {
  const team_id = await events.team_id;

  const variables = {
    team_id,
  };
  const response = await Hasura(deleteTeam, variables);

  if (response.success) {
    callback(null, response.result);
  } else {
    callback(null, response.errors);
  }
};
