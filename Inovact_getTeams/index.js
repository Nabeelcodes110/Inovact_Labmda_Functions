const { query: Hasura } = require('./utils/hasura');
const { getUserTeams, getTeam } = require('./queries/queries');
const { cleanTeamDocs } = require('./utils/cleanTeamDocs');

exports.handler = async (events, context, callback) => {
  const team_id = events.team_id;

  let query;
  let variables = {};

  // Choose the varialbes and query based on the team_id
  if (team_id) {
    variables['team_id'] = team_id;

    query = getTeam;
  } else {
    if (events.admin) variables['admin'] = true;
    else variables['admin'] = false;

    variables['cognito_sub'] = events.cognito_sub;

    query = getUserTeams;
  }

  // Run the query
  const response = await Hasura(query, variables);

  if (!response.success)
    return callback(null, {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response.errors),
      data: null,
    });

  if (team_id) {
    if (response.result.data.team.length == 0) {
      callback(null, {
        success: false,
        errorCode: 'NotFound',
        errorMessage: 'Team not found',
        data: null,
      });
    } else {
      const cleanedTeamDoc = cleanTeamDocs(response.result.data.team[0]);

      callback(null, cleanedTeamDoc);
    }
  } else {
    const cleanedTeamDocs = response.result.data.team.map(cleanTeamDocs);

    callback(null, cleanedTeamDocs);
  }
};
