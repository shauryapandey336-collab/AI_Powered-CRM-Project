export const sendSuccess = (res, statusCode = 200, message = "Success", data = null, meta = undefined) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== undefined) {
    response.pagination = meta;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (res, statusCode = 500, message = "An error occurred", errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
