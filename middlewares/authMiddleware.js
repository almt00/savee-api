const { expressjwt, ExpressJwtRequest } = require("express-jwt");
const jwt = require("jsonwebtoken");

const authenticate = expressjwt({
  secret: process.env.TOKEN_SECRET,
  issuer: process.env.TOKEN_ISSUER,
  algorithms: ["HS256"],
  requestProperty: "auth",
  getToken: function fromHeaderOrQuerystring(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    } else if (req.headers["x-cron-token"]) {
      // Generate a token specifically for the cron job
      const secretKey = process.env.TOKEN_SECRET;
      const issuer = process.env.TOKEN_ISSUER;

      const token = jwt.sign({}, secretKey, {
        expiresIn: "24h",
        issuer: issuer,
      });

      return token;
    }
    return null;
  },
});

module.exports = authenticate;
