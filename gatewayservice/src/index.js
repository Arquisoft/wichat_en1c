// @ts-check

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const promBundle = require("express-prom-bundle");
const { STATUS_CODES } = require("http");

const config = require("./config");
const proxy = require("./proxy");
const auth = require("./auth");
const swagger = require("./swagger");

// Create app
const app = express();
// @ts-expect-error
app.use(helmet.default(config.helmet));
app.use(cors(config.cors));

// Setup Metrics
const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

// Health Check
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

// Setup Proxy
auth(app);
proxy(app);

// Swagger
swagger(app);

// Default Handler
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: STATUS_CODES[404],
  });
});

// Error Handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (!res.writableEnded) {
    const status = (err.expose ? err.status : undefined) ?? 500;
    res.status(status).json({ success: false, message: STATUS_CODES[status] });
  }
});

// Start Server
const server = app.listen(config.port, () => {
  console.log(`Gateway Service listening at http://localhost:${config.port}`);
});

module.exports = server;
