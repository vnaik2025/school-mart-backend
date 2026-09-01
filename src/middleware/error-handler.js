import { sendError } from '../utils/response-handler.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  let errors = [];

  // Joi validation errors
  if (err.isJoi) {
    errors = err.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/['"]/g, '')
    }));
    logger.warn(`Validation failed: ${message}`, { rid: req.rid, errors });
    return sendError(res, 'Validation failed', errors, 400);
  }

  // Sequelize validation and constraint errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    errors = err.errors.map((item) => ({
      field: item.path,
      message: item.message
    }));
    logger.warn(`Database validation failed: ${message}`, { rid: req.rid, errors });
    return sendError(res, 'Database validation failed', errors, 400);
  }

  // Unhandled internal errors
  if (statusCode === 500) {
    logger.error('Unhandled internal server error', err, { rid: req.rid });
    return sendError(
      res,
      process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : message,
      [],
      500
    );
  }

  logger.warn(`Application error: ${message}`, { rid: req.rid });
  return sendError(res, message, err.errors || [], statusCode);
};
