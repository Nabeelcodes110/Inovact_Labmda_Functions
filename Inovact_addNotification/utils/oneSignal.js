const axios = require('axios');

async function notify(message, users) {
  const result = await axios
    .post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: 'ONE_SIGNAL_APP_ID',
        contents: {
          en: message,
        },
        include_external_user_ids: users,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'ONE_SIGNAL_API_KEY',
        },
      }
    )
    .then(response => {
      const responseData = response.data;

      if (responseData.id) {
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

module.exports = { notify };
