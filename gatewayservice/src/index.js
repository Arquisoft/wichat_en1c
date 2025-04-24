// @ts-check

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const promBundle = require("express-prom-bundle");
const {
  setupDefaultHandlers,
  startServer,
  setupLogger,
} = require("@wichat_en1c/common");

const config = require("./config");

// Create app
const app = express();

// Middleware
// @ts-expect-error
app.use(helmet.default(config.helmet));
app.use(cors(config.cors));
setupLogger(app, config.name);

const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

// Health Check
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

// Setup Proxy
require("./auth")(app);
require("./proxy")(app);

// Swagger
require("./swagger")(app);

setupDefaultHandlers(app);

module.exports = startServer(app, config.port);
