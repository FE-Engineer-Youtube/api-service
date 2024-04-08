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
  const showUnits = req.query.showUnits === "true";
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

router.post("/", validateApiKey, async (req, res) => {
  console.log(req.body);
  const pos1 = { lat: req.body.p1.Lat, lon: req.body.p1.Long };
  const pos2 = { lat: req.body.p2.Lat, lon: req.body.p2.Long };
  const unit = req.body.unit || "mi";
  const showUnits = req.body.showUnits === "true";
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

module.exports = router;
