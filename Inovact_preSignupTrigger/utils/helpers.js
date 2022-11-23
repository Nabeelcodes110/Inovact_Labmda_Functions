const getOfficialProviderName = providerName => {
  if (providerName === 'google') {
    return 'Google';
  } else if (providerName === 'auth0-linkedin') {
    return 'Auth0-LinkedIn';
  } else {
    return providerName;
  }
};

module.exports = {
  getOfficialProviderName,
};
