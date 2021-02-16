const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

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
