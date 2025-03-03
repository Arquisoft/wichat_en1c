// @ts-check
const express = require("express");
const mongoose = require("mongoose");

const public = require("./routes/public");
const verify = require("./routes/verify");
const config = require("./config");

// Configure Express
const app = express();

app.set("trust proxy", true);
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoUri);

// Routes
public(app);
verify(app);

// Server start/stop
app
  .listen(config.port, () => {
    console.log(`Auth Service listening at http://localhost:${config.port}`);
  })
  .on("close", mongoose.connection.close);

module.exports = app;
