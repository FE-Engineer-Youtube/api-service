const express = require("express");
const QRCode = require("qrcode");
const openapi = require("@wesleytodd/openapi");
const router = express.Router();
// middleware that is specific to this router

const dotenv = require("dotenv");

dotenv.config();

const messages = {
  403: { message: "You is Forbidded!" },
  401: { message: "You shall not pass!" },
  400: { message: "Missing required data" },
};

// define the home page route
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
