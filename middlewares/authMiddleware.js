const { expressjwt, ExpressJwtRequest } = require("express-jwt");

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
    }
    return null;
  },
});

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};

module.exports = { authenticate, logout };
