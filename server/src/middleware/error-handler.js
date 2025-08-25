import pool from '../config/database.js';

// Custom error class for application errors
export class AppError extends Error {
  constructor(message, statusCode, code = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Database error logging
async function logError(error, req = null) {
  try {
    const errorData = {
      error_type: error.constructor.name,
      error_message: error.message,
      stack_trace: error.stack,
      user_id: req?.user?.id || null,
      request_path: req?.path || null,
      request_method: req?.method || null,
      ip_address: req?.ip || null,
      user_agent: req?.get('User-Agent') || null,
      metadata: {
        statusCode: error.statusCode,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString()
      }
    };

    await pool.query(`
      INSERT INTO error_logs (
        error_type, error_message, stack_trace, user_id, 
        request_path, request_method, ip_address, user_agent, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      errorData.error_type,
      errorData.error_message,
      errorData.stack_trace,
      errorData.user_id,
      errorData.request_path,
      errorData.request_method,
      errorData.ip_address,
      errorData.user_agent,
      JSON.stringify(errorData.metadata)
    ]);
  } catch (logError) {
    console.error('Failed to log error to database:', logError);
  }
}

// Main error handler middleware
export const errorHandler = async (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to database
  await logError(error, req);

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
      code: error.code
    });
  }

  // Handle specific error types
  if (err.code === '23505') {
    // PostgreSQL duplicate key error
    const field = extractFieldFromDuplicateError(err.detail);
    error = new AppError(`${field} already exists`, 400, 'DUPLICATE_ENTRY');
  }

  if (err.code === '23503') {
    // PostgreSQL foreign key constraint error
    error = new AppError('Referenced record does not exist', 400, 'INVALID_REFERENCE');
  }

  if (err.code === '22P02') {
    // PostgreSQL invalid input syntax
    error = new AppError('Invalid data format', 400, 'INVALID_DATA_FORMAT');
  }

  if (err.name === 'ValidationError') {
    // Validation errors
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400, 'VALIDATION_ERROR');
  }

  if (err.name === 'CastError') {
    // Invalid ID format
    error = new AppError('Invalid ID format', 400, 'INVALID_ID');
  }

  // Set default values if not set
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message = error.message || 'Something went wrong';

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

// Helper function to extract field name from PostgreSQL duplicate error
function extractFieldFromDuplicateError(detail) {
  if (!detail) return 'Field';
  
  const match = detail.match(/Key \(([^)]+)\)=/);
  if (match) {
    return match[1].charAt(0).toUpperCase() + match[1].slice(1);
  }
  
  return 'Field';
}

// Not found handler
export const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation error handler
export const validationError = (errors) => {
  const messages = errors.map(err => `${err.param}: ${err.msg}`);
  return new AppError(messages.join(', '), 400, 'VALIDATION_ERROR', { errors });
};