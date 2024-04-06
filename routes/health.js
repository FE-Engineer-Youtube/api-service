const express = require("express");
const router = express.Router();

// Endpoint to get WHOIS data for a domain (GET)
router.get("/", async (req, res) => {
  res.status(200).send({ message: "success" });
});

module.exports = router;
