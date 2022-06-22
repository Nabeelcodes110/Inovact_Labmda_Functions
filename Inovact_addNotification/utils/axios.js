const axios = require('axios');
const http = require('http');
const https = require('https');

const instance = axios.create({
  baseURL: process.env.HASURA_API,
  headers: {
    'content-type': 'application/json',
    'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
  },
  httpAgent: new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 60 * 60 * 1000,
    maxSockets: Infinity,
  }),
  httpsAgent: new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 60 * 60 * 1000,
    maxSockets: Infinity,
  }),
});

module.exports = instance;
