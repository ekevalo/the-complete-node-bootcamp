class AppError extends Error {
  constructor(message, statusCode) {
    // Calling parent constructor of base Error class.
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
