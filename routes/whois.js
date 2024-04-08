const express = require("express");
const router = express.Router();
const validateUrl = require("../utils/urlSanitizer");
const { handleErrors } = require("../utils/utils");
const whoiser = require("whoiser");
// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-rapidapi-proxy-secret"] !== process.env.WEB_UTILITIES
  ) {
    handleErrors(res, 401);
    return;
  }
  next();
};

router.post("/", validateApiKey, validateUrl, async (req, res) => {
  try {
    const whois = await whoiser(req.domain);

    return res.status(200).json(whois);
  } catch (err) {
    return handleErrors(res, 500, err);
  }
});

router.get("/", validateApiKey, validateUrl, async (req, res) => {
  try {
    const whois = await whoiser(req.domain);

    return res.status(200).json(whois);
  } catch (err) {
    return handleErrors(res, 500, err);
  }
});

module.exports = router;
