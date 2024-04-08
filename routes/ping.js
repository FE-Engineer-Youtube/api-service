const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const { handleErrors } = require("../utils/utils");
const { parsePingResponse } = require("../utils/ping");
const sanitizeUrl = require("../utils/pingSanitizer");
const { ping } = require("tcp-ping-node");

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

router.get("/", validateApiKey, sanitizeUrl, async (req, res) => {
  const url = req.sanitizedUrl;
  const { port = 443 } = req.query;

  try {
    let data = await ping({ host: url, port: port, timeout: 1000 });

    return res.status(200).send(data);
  } catch (err) {
    return handleErrors(res, 400, err);
  }
});

router.post("/", validateApiKey, sanitizeUrl, async (req, res) => {
  const url = req.sanitizedUrl;
  const { port = 443 } = req.body;

  try {
    let data = await ping({ host: url, port: port, timeout: 1000 });

    return res.status(200).send(data);
  } catch (err) {
    return handleErrors(res, 400, err);
  }
});

module.exports = router;
