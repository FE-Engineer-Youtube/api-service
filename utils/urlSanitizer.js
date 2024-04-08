// middleware/validateUrl.js

const { validationResult } = require("express-validator");
const { handleErrors } = require("../utils/utils");
const he = require("he");

const validateUrl = (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleErrors(res, 400, errors.array());
  }

  // Sanitize and format the URL
  var domain = req.query.url || req.body.url;
  domain = domain.trim();
  domain = he.decode(domain);
  domain = decodeURIComponent(domain);
  domain = domain.replace(/^https?:\/\//, "");
  req.domain = domain;
  next();
};

module.exports = validateUrl;
