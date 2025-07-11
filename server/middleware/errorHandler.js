import colors from 'colors';

const errorHandler = (err, req, res, next) => {
  // Use the status code from the response if it's already set, otherwise default to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Log to console for the developer
  // console.error(err.stack.red);
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = `Resource not found`;
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    statusCode = 400;
  }
  
  res.status(statusCode).json({
    message: message,
    // Provide stack trace only in development environment
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export default errorHandler;