// utils/apiValidation.js

const { handleErrors } = require("../utils/utils");

const validateApiKey = (req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    (!req.headers["x-rapidapi-proxy-secret"] ||
      !req.headers["x-rapidapi-secret"])
  ) {
    handleErrors(res, 401);
    return;
  }
  next();
};

module.exports = validateApiKey;
