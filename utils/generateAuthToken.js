const jwt = require("jsonwebtoken");

function generateAuthToken(user) {
  return jwt.sign(
    {
      iss: process.env.TOKEN_ISSUER,
      sub: user.user_id,
      iat: new Date().getTime(),
      // one day after
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    process.env.TOKEN_SECRET
  );
}

module.exports = generateAuthToken;
