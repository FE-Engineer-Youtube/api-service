const express = require("express");
const router = express.Router();
const { handleErrors } = require("../utils/utils");
const NodeGeolocation = require("nodejs-geolocation").default;

const geo = new NodeGeolocation("MyApp");

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-rapidapi-proxy-secret"] !== process.env.GEO
  ) {
    handleErrors(res, 401);
    return;
  }
  next();
};

router.get("/", validateApiKey, async (req, res) => {
  const pos1 = { lat: req.query.p1Lat, lon: req.query.p1Long };
  const pos2 = { lat: req.query.p2Lat, lon: req.query.p2Long };
  const unit = req.query.unit || "mi";
  const showUnits = req.query.show === "true";
  try {
    const distance = await geo.calculateDistance(pos1, pos2, {
      unit: unit === "mi" ? "mi" : "km",
      format: showUnits,
    });
    return res.status(200).json({
      data: {
        distance: distance,
        units: unit === "mi" ? "miles" : "kilometers",
      },
    });
  } catch (err) {
    return res.status(400).json(err);
  }
});

// router.post("/", validateApiKey, async (req, res) => {
//   try {
//     const records = await tangerine.resolveAny(req.domain);
//     return res.status(200).json(records);
//   } catch (err) {
//     return res.status(400).json(err);
//   }
});

module.exports = router;
