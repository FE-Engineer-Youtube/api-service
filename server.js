const express = require("express");
const app = express();
const validateApiKey = require("./utils/apiValidation");

// Apply API key validation middleware to all routes
app.use(validateApiKey);

// Import and use all API route modules
const apiRoutes = {
  "/qr": require("./routes/qr"),
  "/ping": require("./routes/ping"),
  "/whois": require("./routes/whois"),
};

for (const [route, handler] of Object.entries(apiRoutes)) {
  app.use(route, handler);
}

// Other non-API routes can be defined here...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Example app is listening on port ${PORT}.`)
);
