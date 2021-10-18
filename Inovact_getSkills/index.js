const { query: Hasura } = require('./utils/hasura');
const { getSkills, getSkillsWithPrefix } = require('./queries/queries');

exports.handler = async (event, context, callback) => {
  const prefix = event.prefix;

  let response;
  if (prefix) {
    response = await Hasura(getSkillsWithPrefix, {
      _skill: prefix + '%',
    });
  } else {
    response = await Hasura(getSkills);
  }

  if (response.success) {
    callback(null, response.result);
  } else {
    callback(null, response.errors);
  }
};
