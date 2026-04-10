/**
 * @desc  404 Not Found handler
 * Must be placed after all routes.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * @desc  Global error handler middleware
 * Returns a consistent JSON error response for all thrown errors.
 */
export const errorHandler = (err, req, res, next) => {
  // If status is still 200, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Include stack trace only in development
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
