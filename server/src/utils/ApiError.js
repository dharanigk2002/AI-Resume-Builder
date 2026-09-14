export class ApiError extends Error {
  constructor(statusCode, error, message = "Something went wrong", stack) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    if (this.stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
