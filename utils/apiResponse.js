function success(data, meta = {}, message = "OK", statusCode = 200) {
  return {
    message,
    data,
    meta: {
      ...meta,
      statusCode,
      error: false,
    },
  };
}

function error(message = "Server error", statusCode = 500, errors = []) {
  return {
    message,
    meta: {
      statusCode,
      error: true,
      errors,
    },
  };
}

module.exports = {
  success,
  error,
};
