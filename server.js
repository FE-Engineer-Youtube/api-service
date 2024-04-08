const express = require("express");
const validateApiKey = require("./utils/apiValidation");
const cors = require("cors");
const serverHealth = require("server-health");

const app = express();
// Parse JSON-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors("*")); // This Cross Origin Handling

// Apply API key validation middleware to all routes
app.use(validateApiKey);

// Parse URL-encoded request bodies

// Import and use all API route modules
const apiRoutes = {
  "/qr": require("./routes/qr"),
  "/ping": require("./routes/ping"),
  "/whois": require("./routes/whois"),
  "/dns": require("./routes/dns"),
  "/getDistance": require("./routes/getDistance"),
};

for (const [route, handler] of Object.entries(apiRoutes)) {
  app.use(route, handler);
}

// Other non-API routes can be defined here...

serverHealth.exposeHealthEndpoint(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API's are listening on port ${PORT}.`));

module.exports = app;
