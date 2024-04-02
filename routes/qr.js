const express = require("express");
const QRCode = require("qrcode");
const openapi = require("@wesleytodd/openapi");
const router = express.Router();
// middleware that is specific to this router

const allowedUrls = [
  "localhost:3000",
  "rapidapi.com",
  "by7e.me",
  "192.168.3.9:3000",
];

// define the home page route
router.get("/", async (req, res) => {
  if (!allowedUrls.includes(req.headers.host)) {
    res.status(403).send("Forbidden");
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
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/image", async (req, res) => {
  console.log(req.headers.host);
  if (!allowedUrls.includes(req.headers.host)) {
    res.status(403).send("Forbidden");
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
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).send("Internal Server Error");
  }
});

const oapi = openapi({
  openapi: "3.0.0",
  info: {
    title: "QR Open API Specs",
    description: "QR Code generator generated api documents",
    version: "1.0.0",
  },
});

router.use(oapi);

// To add path specific schema you can use the .path middleware
router.get(
  "/oapi",
  oapi.path({
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                hello: { type: "string" },
              },
            },
          },
        },
      },
    },
  }),
  (req, res) => {
    res.json({
      hello: "world",
    });
  }
);

module.exports = router;
