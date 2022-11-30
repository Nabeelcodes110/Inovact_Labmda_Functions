const getOfficialProviderName = providerName => {
  if (providerName === 'google') {
    return 'Google';
  } else if (providerName === 'linkedin') {
    return 'LinkedIn';
  } else {
    return providerName;
  }
};

module.exports = {
  getOfficialProviderName,
};
