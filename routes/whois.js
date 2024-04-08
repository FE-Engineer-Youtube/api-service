const express = require("express");
const router = express.Router();
const validateUrl = require("../utils/urlSanitizer");
const { handleErrors } = require("../utils/utils");
const whois = require("whois");
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

// Endpoint to get WHOIS data for a domain (POST)
router.post("/", validateApiKey, validateUrl, async (req, res) => {
  try {
    const res = await whois.lookup(req.domain);

    return res.status(200).json(whoisData);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// Endpoint to get WHOIS data for a domain (GET)
router.get("/", validateApiKey, validateUrl, async (req, res) => {
  try {
    const res = await whois.lookup(req.domain);

    return res.status(200).json(whoisData);
  } catch (err) {
    return res.status(400).json(err);
  }
});

module.exports = router;
