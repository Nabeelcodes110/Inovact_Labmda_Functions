const { query: Hasura } = require('./utils/hasura');
const { userNotifications } = require('./queries/queries');

exports.handler = async (events, context, callback) => {
  const { cognito_sub } = events;

  const oneDayBeforeNow = new Date();
  oneDayBeforeNow.setDate(oneDayBeforeNow.getDate() - 1);

  const response = await Hasura(userNotifications, {
    cognito_sub,
    yesterday: oneDayBeforeNow,
  });

  if (!response.success) return callback(null, response.errors);

  callback(null, response.result);
};
