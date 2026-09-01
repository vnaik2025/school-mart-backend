export const sendSuccess = (res, data = {}, message = 'Operation completed successfully', statusCode = 200) => {
  const rid = res.req?.rid || '';
  return res.status(statusCode).json({
    success: true,
    message,
    rid,
    data
  });
};

export const sendError = (res, message = 'An error occurred', errors = [], statusCode = 400) => {
  const rid = res.req?.rid || '';
  return res.status(statusCode).json({
    success: false,
    message,
    rid,
    errors: Array.isArray(errors) ? errors : [errors]
  });
};
