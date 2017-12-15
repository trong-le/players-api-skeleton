const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'mysecret';

module.exports = function verifyJwt() {
  return async (req, res, next) => {
    // Pull header out
    const authHeader = req.header('Authorization');
    if (typeof authHeader !== 'undefined') {
      // Get token from header
      const codedToken = authHeader.split(' ')[1];
      const verify = promisify(jwt.verify, jwt);

      // Decoded token and add to request
      const decodedToken = await verify(codedToken, jwtSecret);
      req.token = decodedToken;
      next();
    } else {
      res.status(403).send();
    }
  };
};