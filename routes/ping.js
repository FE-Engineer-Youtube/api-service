const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const { handleErrors } = require("../utils/utils");
const { parsePingResponse } = require("../utils/ping");
const sanitizeUrl = require("../utils/pingSanitizer");

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
// router.post("/", validateApiKey, validateUrl, async (req, res) => {
//   // Execute WHOIS command
//   exec(`ping -c 4 ${url}`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error executing Ping command: ${error.message}`);
//       return handleErrors(res, 500);
//     }
//     if (stderr) {
//       console.error(`Ping command encountered an error: ${stderr}`);
//       return handleErrors(res, 400);
//     }

//     // Parse the WHOIS response
//     const whoisData = parseWhoisResponse(stdout);

//     // Return the parsed WHOIS data in JSON format
//     res.json(whoisData);
//   });
// });

// Endpoint to get WHOIS data for a domain (GET)
router.get("/", validateApiKey, sanitizeUrl, async (req, res) => {
  const url = req.sanitizedUrl;
  // Execute ping command
  exec(`ping -c 6 -i 0.2 ${url}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Ping command: ${error.message}`);
      return handleErrors(res, 500);
    }
    if (stderr) {
      console.error(`Ping command encountered an error: ${stderr}`);
      return handleErrors(res, 400);
    }

    // Parse the response
    const pingData = parsePingResponse(stdout);
    return res.status(200).json(pingData);
  });
});

module.exports = router;
