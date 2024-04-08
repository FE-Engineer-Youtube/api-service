const express = require("express");
const router = express.Router();
const validateUrl = require("../utils/urlSanitizer");
const { handleErrors } = require("../utils/utils");
const Tangerine = require("tangerine");

const tangerine = new Tangerine();

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

router.get("/", validateApiKey, validateUrl, async (req, res) => {
  try {
    const records = await tangerine.resolveAny(req.domain);
    return res.status(200).json(records);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/", validateApiKey, validateUrl, async (req, res) => {
  try {
    const records = await tangerine.resolveAny(req.domain);
    return res.status(200).json(records);
  } catch (err) {
    return res.status(400).json(err);
  }
});

module.exports = router;
