const express = require("express");
const app = express();
const validateApiKey = require("./utils/apiValidation");
const cors = require("cors");

app.use(cors("*")); // This Cross Origin Handling

// Apply API key validation middleware to all routes
app.use(validateApiKey);

// Parse JSON-encoded request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Import and use all API route modules
const apiRoutes = {
  "/qr": require("./routes/qr"),
  "/ping": require("./routes/ping"),
  "/whois": require("./routes/whois"),
  "/ping": require("./routes/ping"),
};

for (const [route, handler] of Object.entries(apiRoutes)) {
  app.use(route, handler);
}

// Other non-API routes can be defined here...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Example app is listening on port ${PORT}.`)
);
