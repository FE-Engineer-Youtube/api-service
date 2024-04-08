const { handleErrors } = require("../utils/utils");

// Middleware to sanitize and validate URL or IP
const sanitizeUrl = (req, res, next) => {
  let { url } = req.query || req.body;

  // Regular expressions to validate URL and IP
  const urlRegex = /^(http|https):\/\/([\w\d]+\.[\w\d]+)(:[\d]+)?\/?/;
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

  if (!url) {
    return handleErrors(res, 400);
  }

  if (!url.match(urlRegex) && !url.match(ipRegex)) {
    return handleErrors(res, 400);
  }

  url = url.replace(/http(s)?:\/\//g, "");
  req.sanitizedUrl = url;
  next();
};

module.exports = sanitizeUrl;
