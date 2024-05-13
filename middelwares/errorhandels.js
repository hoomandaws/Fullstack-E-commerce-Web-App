const errorhandels = (err, req, res, next) => {
  let statusCode = 500;
  let message = "server error";
  let error = err.name;
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Bad request";
  }
  return res.status(statusCode).send({
    error,
    message,
    stack: err.stack,
  });
};
module.exports = errorhandels;
