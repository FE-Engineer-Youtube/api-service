// utils/apiValidation.js

const validateApiKey = (req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-rapidapi-proxy-secret"] !== process.env.RAPID_SECRET
  ) {
    res.status(401).send(messages[401]);
    return;
  }
  next();
};

module.exports = validateApiKey;
