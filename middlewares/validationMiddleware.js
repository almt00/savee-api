/*const { validationResult } = require("express-validator");
const { error } = require("../utils/apiResponse");
const { ValidationError } = require("../utils/errors");

const validationMiddleware = (...checks) => [
  ...checks,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = ValidationError(errors.errors);
      res
        .status(err.statusCode || 500)
        .send(error(err.message, err.statusCode || 500, err.errors));
    } else {
      next();
    }
  },
];

module.exports = {
  validationMiddleware,
};*/
