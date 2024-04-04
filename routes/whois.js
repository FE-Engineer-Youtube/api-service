const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const { parseWhoisResponse } = require("../utils/whois");
const validateUrl = require("../utils/urlSanitizer");
const { handleErrors } = require("../utils/utils");

// Endpoint to get WHOIS data for a domain (POST)
router.post("/", validateUrl, async (req, res) => {
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

// Endpoint to get WHOIS data for a domain (GET)
router.get("/", validateUrl, async (req, res) => {
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
