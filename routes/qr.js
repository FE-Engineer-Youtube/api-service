const fs = require("fs");
const path = require("path");
const express = require("express");
const QRCode = require("qrcode");
const openapi = require("@wesleytodd/openapi");
const router = express.Router();
// middleware that is specific to this router

const dotenv = require("dotenv");
const { messages } = require("../utils/utils");

dotenv.config();

router.get("/", async (req, res) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-rapidapi-proxy-secret"] !== process.env.RAPID_SECRET
  ) {
    res.status(401).send(messages[401]);
    res.end();
    return;
  }
  try {
    const url = req.query.url || "https://example.com";
    const size = req.query.size || 200;
    const qrCodeImage = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      width: size,
    });
    res.status(200).send({
      data: {
        base64: qrCodeImage,
        text: url,
      },
    });
    res.end();
    return;
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).send("Internal Server Error");
    res.end();
    return;
  }
});

router.get("/data", async (req, res) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-rapidapi-proxy-secret"] !== process.env.RAPID_SECRET
  ) {
    res.status(401).send(messages[401]);
    res.end();
    return;
  }
  try {
    const url = req.query.url || "https://example.com";
    const size = req.query.size || 200;
    const qrCodeImage = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      width: size,
    });
    res.status(200).send({
      data: {
        base64: qrCodeImage,
        text: url,
      },
    });
    res.end();
    return;
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).send("Internal Server Error");
    res.end();
    return;
  }
});

router.get("/file", async (req, res) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-rapidapi-proxy-secret"] !== process.env.RAPID_SECRET
  ) {
    res.status(401).send(messages[401]);
    return;
  }
  try {
    const url = req.query.url || "https://example.com";
    const size = req.query.size || 200;
    const qrCodeImage = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      width: size,
    });

    // Convert base64 image to buffer
    const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Create folder structure based on current date
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 since January is 0
    const day = String(currentDate.getDate()).padStart(2, "0");
    const folderPath = path.join(__dirname, "../images", year, month, day);
    fs.mkdirSync(folderPath, { recursive: true }); // Create folder recursively if it doesn't exist

    // Generate a unique filename with epoch time
    const epochTime = Date.now();
    const filename = `qrcode_${epochTime}.png`;
    const filePath = path.join(folderPath, filename);

    // Write buffer to file
    fs.writeFileSync(filePath, buffer);

    // Set headers for file download
    res.setHeader("Content-Disposition", 'attachment; filename="qrcode.png"');
    res.setHeader("Content-Type", "image/png");

    // Send file as response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/image", async (req, res) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-rapidapi-proxy-secret"] !== process.env.RAPID_SECRET
  ) {
    res.status(401).send(messages[401]);
    res.end();
    return;
  }
  try {
    const url = req.query.url || "https://example.com";
    const size = req.query.size || 200;
    const pattern = req.query.pattern || 0;
    const qrCodeImage = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      width: size,
      maskPattern: pattern,
    });
    res.send(`<img src="${qrCodeImage}" alt="QR Code"/>`);
    res.end();
    return;
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).send("Internal Server Error");
    res.end();
    return;
  }
});

// const oapi = openapi({
//   openapi: "3.0.0",
//   info: {
//     title: "QR Open API Specs",
//     description: "QR Code generator generated api documents",
//     version: "1.0.0",
//   },
// });

// router.use(oapi);

// To add path specific schema you can use the .path middleware
// router.get(
//   "/oapi",
//   oapi.path({
//     responses: {
//       200: {
//         description: "Successful response",
//         content: {
//           "application/json": {
//             schema: {
//               type: "object",
//               properties: {
//                 hello: { type: "string" },
//               },
//             },
//           },
//         },
//       },
//     },
//   }),
//   (req, res) => {
//     res.json({
//       hello: "world",
//     });
//   }
// );

module.exports = router;
