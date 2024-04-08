const express = require("express");
const router = express.Router();
const validateUrl = require("../utils/urlSanitizer");
const { handleErrors } = require("../utils/utils");
const Tangerine = require("tangerine");

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

// Endpoint to get DNS data for a domain (GET)
router.get("/", validateApiKey, validateUrl, async (req, res) => {
  // Execute WHOIS command
  const tangerine = new Tangerine();

  const records = await tangerine.resolveAny(req.domain);

  return res.status(200).json(records);
});

// Endpoint to get DNS data for a domain (GET)
router.post("/", validateApiKey, validateUrl, async (req, res) => {
  // Execute WHOIS command
  const tangerine = new Tangerine();

  const records = await tangerine.resolveAny(req.domain);

  return res.status(200).json(records);
});

module.exports = router;
