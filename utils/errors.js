function NotFoundError(message) {
  const error = new Error(message || "Resource not found");
  error.statusCode = 404;

  return error;
}

function ValidationError(errors, message) {
  const error = new Error(message || "Validation error");
  error.statusCode = 422;
  error.errors = errors;

  return error;
}

function ConflictError(message) {
  const error = new Error(message || "Conflict error");
  error.statusCode = 409;

  return error;
}

function UnauthorizedError(message) {
  const error = new Error(message || "Unauthorized error");
  error.statusCode = 401;

  return error;
}

module.exports = {
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
};
