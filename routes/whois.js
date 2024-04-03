const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const { parseWhoisResponse } = require("../utils/whois");
const { query, body, validationResult } = require("express-validator");
const he = require("he");

// Endpoint to get WHOIS data for a domain
router.post(
  "/",
  [
    // Validate and sanitize the domain parameter
    body("url")
      .trim()
      .escape()
      .isURL({ require_protocol: true })
      .withMessage("Invalid URL"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let domain = req.body.url;

    // Strip any protocol prefix from the domain
    domain = domain.replace(/^https?:\/\//, "");

    // Run the whois command in the shell
    exec(`whois ${domain}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing WHOIS command: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (stderr) {
        console.error(`WHOIS command encountered an error: ${stderr}`);
        return res.status(400).json({ error: "Bad Request" });
      }

      // Parse the WHOIS response
      const whoisData = parseWhoisResponse(stdout);

      // Return the parsed WHOIS data in JSON format
      res.json(whoisData);
      res.end();
      return;
    });
  }
);

// Endpoint to get WHOIS data for a domain
router.get(
  "/",
  [
    // Validate and sanitize the domain parameter
    query("url")
      .trim()
      .escape()
      .customSanitizer((value) => {
        // Decode HTML entities before URI decoding
        value = he.decode(value);
        // Decode URI
        value = decodeURIComponent(value);
        return value;
      })
      .isURL({ require_protocol: true })
      .withMessage("Invalid URL"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let domain = req.query.url;

    // Strip any protocol prefix from the domain
    domain = domain.replace(/^https?:\/\//, "");

    // Run the whois command in the shell
    exec(`whois ${domain}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing WHOIS command: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (stderr) {
        console.error(`WHOIS command encountered an error: ${stderr}`);
        return res.status(400).json({ error: "Bad Request" });
      }

      // Parse the WHOIS response
      const whoisData = parseWhoisResponse(stdout);

      // Return the parsed WHOIS data in JSON format
      res.json(whoisData);
      res.end();
      return;
    });
  }
);

module.exports = router;
