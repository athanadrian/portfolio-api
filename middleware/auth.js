const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const request = require('request');
//const config = require('../config');
const dotenv = require('dotenv');

dotenv.config();
// Authentication middleware
// This middleware will check access token in authorization headers
// of a request
// It will verify access token against Auth0 JSON web key set
exports.checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: 'https://atana.eu.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://atana.eu.auth0.com/api/v2/',
  issuer: 'https://atana.eu.auth0.com/',
  algorithms: ['RS256'],
});

exports.checkRole = (role) => (req, res, next) => {
  const user = req.user;
  if (user && user[process.env.AUTH0_NAMESPACE_ROLES].includes(role)) {
    next();
  } else {
    return res
      .status(401)
      .send('You are not authorized to access this resource!');
  }
};

exports.getAccessToken = (callback) => {
  const options = {
    method: 'POST',
    url: process.env.AUTH0_TOKEN_URL,
    headers: { 'content-type': 'application/json' },
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
    },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (error) {
        return reject(new Error(error));
      }

      resolve(body ? JSON.parse(body) : '');
    });
  });
};

exports.getAuth0User = (accessToken) => (userId) => {
  const options = {
    method: 'GET',
    url: `${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}?fields=name,nickname,picture,user_id`,
    headers: { authorization: `Bearer ${accessToken}` },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (error) {
        return reject(new Error(error));
      }

      resolve(body ? JSON.parse(body) : '');
    });
  });
};
