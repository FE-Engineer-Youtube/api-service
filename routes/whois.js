const router = express.Router();
// middleware that is specific to this router

const express = require("express");
const { exec } = require("child_process");
const { parseWhoisResponse } = require("../utils/whois");

const dotenv = require("dotenv");

dotenv.config();

// Endpoint to get WHOIS data for a domain
router.get("/whois/:domain", (req, res) => {
  const domain = req.params.domain;

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
  });
});

module.exports = router;
