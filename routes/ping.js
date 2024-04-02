const express = require("express");
const router = express.Router();
// middleware that is specific to this router

// define the home page route
router.get("/", async (req, res) => {
  res.status(200).send({
    data: {
      message: "success",
    },
  });
});

module.exports = router;
