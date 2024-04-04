const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const { parseWhoisResponse } = require("../utils/whois");
const validateUrl = require("../utils/urlSanitizer");
const { handleErrors } = require("../utils/utils");

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
router.post("/", validateApiKey, async (req, res) => {
  console.log(req.body || "no body");
  // Execute WHOIS command
  exec(`whois ${req.body.url}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing WHOIS command: ${error.message}`);
      return handleErrors(res, 500);
    }
    if (stderr) {
      console.error(`WHOIS command encountered an error: ${stderr}`);
      return handleErrors(res, 400);
    }

    // Parse the WHOIS response
    const whoisData = parseWhoisResponse(stdout);

    // Return the parsed WHOIS data in JSON format
    res.json(whoisData);
  });
});

// Endpoint to get WHOIS data for a domain (GET)
router.get("/", validateApiKey, validateUrl, async (req, res) => {
  // Execute WHOIS command
  exec(`whois ${req.domain}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing WHOIS command: ${error.message}`);
      return handleErrors(res, 500);
    }
    if (stderr) {
      console.error(`WHOIS command encountered an error: ${stderr}`);
      return handleErrors(res, 400);
    }

    // Parse the WHOIS response
    const whoisData = parseWhoisResponse(stdout);

    // Return the parsed WHOIS data in JSON format
    res.json(whoisData);
  });
});

module.exports = router;
