// @ts-check
const express = require("express");
const mongoose = require("mongoose");
const { STATUS_CODES } = require("http");

const config = require("./config");
const save = require("./routes/save");
const pub = require("./routes/pub");

// Configure Express
const app = express();

app.set("trust proxy", true);
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoUri);

// Routes
pub(app);
save(app);

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

// Server start/stop
module.exports = app
  .listen(config.port, () => {
    console.log(
      `Statistics Service listening at http://localhost:${config.port}`
    );
  })
  .on("close", async () => await mongoose.connection.close());
