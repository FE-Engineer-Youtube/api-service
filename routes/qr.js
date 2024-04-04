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
    req.headers["x-rapidapi-proxy-secret"] !== process.env.RAPID_SECRET
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
    res.status(200).send({ data: { base64: qrCodeImage, text: url } });
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
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const folderPath = path.join(__dirname, "../images", year, month, day);
    fs.mkdirSync(folderPath, { recursive: true });
    const epochTime = Date.now();
    const filename = `qrcode_${epochTime}.png`;
    const filePath = path.join(folderPath, filename);
    fs.writeFileSync(filePath, buffer);
    res.download(filePath, "qrcode.png");
  } catch (err) {
    return handleErrors(err, 500, err);
  }
});

module.exports = router;
