const fs = require("fs");
const path = require("path");
const express = require("express");
const QRCode = require("qrcode");
const router = express.Router();
const dotenv = require("dotenv");
const { messages } = require("../utils/utils");
const { handleErrors } = require("../utils/utils");

dotenv.config();

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-rapidapi-proxy-secret"] !== process.env.QR
  ) {
    handleErrors(res, 401);
    return;
  }
  next();
};

// Endpoint to generate QR code data
router.get("/data", validateApiKey, async (req, res, next) => {
  try {
    const { url = "https://example.com", size = 200 } = req.query;
    const qrCodeImage = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      width: size,
    });
    return res.status(200).send({ data: { base64: qrCodeImage, text: url } });
  } catch (err) {
    return handleErrors(err, 500, err);
  }
});

// Endpoint to generate and download QR code image file
router.get("/file", validateApiKey, async (req, res, next) => {
  try {
    const { url = "https://example.com", size = 200 } = req.query;
    const qrCodeImage = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      width: size,
    });
    const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    res.setHeader("Content-Type", "image/png");
    return res.status(200).send(buffer);
  } catch (err) {
    return handleErrors(err, 500, err);
  }
});

module.exports = router;
