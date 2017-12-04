const promisify = require('es6-promisify');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'mysecret';

module.exports = function verifyJwt() {
  return (req, res, next) => {
    // Pull header out
    const authHeader = req.header('Authorization');
    if (typeof authHeader !== 'undefined') {
      // Get token from header
      const codedToken = authHeader.split(' ')[1];
      const verify = promisify(jwt.verify, jwt);

      // Decoded token and add to request
      verify(codedToken, jwtSecret)
        .then((decodedToken) => {
          req.token = decodedToken;
          next();
        })
        .catch(next);
    } else {
      res.status(403).send();
    }
  };
};