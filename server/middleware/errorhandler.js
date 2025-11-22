class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  const error =
    err instanceof CustomError
      ? err
      : new CustomError(err.message || "Unknown error");

  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  console.error("UNEXPECTED ERROR :", error);

  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message || "Something went very wrong!",
  });
};

module.exports = {
  CustomError,
  errorHandler,
};
