import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Only log errors in development or if they're not 404s
  if (process.env.NODE_ENV === 'development' || (err.status !== 404 && err.statusCode !== 404)) {
    logger.error(err.message || 'Error');
  }

  // Default error
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Validation errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Invalid or expired token';
  }

  // Supabase errors
  if (err.code === 'PGRST116') {
    status = 404;
    message = 'Resource not found';
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

