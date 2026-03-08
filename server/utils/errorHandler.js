/**
 * Centralized Error Handler for Controllers
 */

import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  PaymentError,
  DatabaseError,
} from './errors.js';

/**
 * Handle errors in controller and send appropriate response
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 */
export const handleControllerError = (res, error) => {
  // Log error for debugging
  console.error('Controller Error:', error);

  // Handle custom error types by name (works across .js and .cjs imports)
  if (error.name === 'ValidationError' || error instanceof ValidationError) {
    return res.status(error.statusCode || 400).json({
      success: false,
      error: error.message,
      type: 'ValidationError',
    });
  }

  if (error.name === 'NotFoundError' || error instanceof NotFoundError) {
    return res.status(error.statusCode || 404).json({
      success: false,
      error: error.message,
      type: 'NotFoundError',
    });
  }

  if (error.name === 'UnauthorizedError' || error instanceof UnauthorizedError) {
    return res.status(error.statusCode || 401).json({
      success: false,
      error: error.message,
      type: 'UnauthorizedError',
    });
  }

  if (error.name === 'ForbiddenError' || error instanceof ForbiddenError) {
    return res.status(error.statusCode || 403).json({
      success: false,
      error: error.message,
      type: 'ForbiddenError',
    });
  }

  if (error.name === 'ConflictError' || error instanceof ConflictError) {
    return res.status(error.statusCode || 409).json({
      success: false,
      error: error.message,
      type: 'ConflictError',
    });
  }

  if (error.name === 'PaymentError' || error instanceof PaymentError) {
    return res.status(error.statusCode || 402).json({
      success: false,
      error: error.message,
      type: 'PaymentError',
    });
  }

  if (error.name === 'DatabaseError' || error instanceof DatabaseError) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: 'Database operation failed',
      type: 'DatabaseError',
    });
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError' && error.errors) {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', '),
      type: 'ValidationError',
    });
  }

  // Handle Mongoose duplicate key error
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry found',
      type: 'ConflictError',
    });
  }

  // Handle Mongoose cast error
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      type: 'ValidationError',
    });
  }

  // Default internal server error
  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    type: 'InternalServerError',
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
