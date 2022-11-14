const axios = require('axios');

const authorize = async (code) => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;
  
  const data = {
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code: code,
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  try {
    const response = await axios.post('https://inovact.auth.ap-south-1.amazoncognito.com/oauth2/token', data, config);

    return {
      success: true,
      errorCode: '',
      errorMessage: '',
      data: {
        idToken: response.data.id_token,
        refreshToken: response.data.refresh_token,
      },
    }
  } catch (error) {
    return {
      success: false,
      errorCode: 'InternalServerError',
      errorMessage: 'Failed to get token',
    }
  }
}

module.exports = {
  authorize,
}
