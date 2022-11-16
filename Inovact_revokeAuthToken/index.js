const axios = require('axios');

const CLIENT_ID_2 = process.env.CLIENT_ID_2;
const CLIENT_SECRET_2 = process.env.CLIENT_SECRET_2;

exports.handler = async (events, context, callback) => {
  const { token, clientId } = events;

  const URL = "https://inovact.auth.ap-south-1.amazoncognito.com/oauth2/revoke"

  // OMG AWS!!!!
  let params;
  let config;

  if (clientId == CLIENT_ID_2) {
    params = {
      token,
    };

    config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${CLIENT_SECRET_2}`).toString('base64')}`,
      }
    };
  } else {
    params = {
      token,
      client_id: clientId,
    };

    config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
  }

  try {
    const response = await axios.post(URL, params, config);

    callback(null, {
      success: true,
      errorCode: "",
      errorMessage: ""
    });
  } catch (error) {
    console.log(error);

    callback(null, {
      success: false,
      errorCode: error.response.data.error,
      errorMessage: error.response.data.error_description
    })
  }
};