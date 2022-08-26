const { query: Hasura } = require('./utils/hasura');
const { add_TeamDocument } = require('./queries/mutations');
const { checkIfAdmin } = require('./queries/queries');
const notify = require('./utils/notify');

exports.handler = async (events, context, callback) => {
  // Check if current user is team admin
  const response1 = await Hasura(checkIfAdmin, {
    cognito_sub: events.cognito_sub,
    team_id: events.team_id,
  });

  if (!response1.success) {
    return {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response1.errors),
    };
  }

  if (
    response1.result.data.current_user.length == 0 ||
    !response1.result.data.current_user[0].admin
  )
    return callback(null, {
      success: false,
      errorCode: 'Forbidden',
      errorMessage: 'You are not an admin of this team',
      data: null,
    });

  // Upload the document info to Hasura
  const response2 = await Hasura(add_TeamDocument, {
    team_id: events.team_id,
    name: events.name,
    url: events.url,
    mime_type: events.mime_type,
  });

  if (!response2.success) {
    return {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: JSON.stringify(response2.errors),
      data: null,
    };
  }

  const user_id = response1.result.data.current_user[0].user_id;

  // Notify the user
  await notify(
    22,
    events.team_id,
    user_id,
    response1.result.data.team_members
      .map(team_member => team_member.user_id)
      .filter(id => id != user_id)
  ).catch(console.log);

  callback(null, {
    success: true,
    errorCode: null,
    errorMessage: null,
  });
};
