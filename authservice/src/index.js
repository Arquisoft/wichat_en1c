// @ts-check
const express = require("express");
const mongoose = require("mongoose");

const pub = require("./routes/pub");
const verify = require("./routes/verify");
const config = require("./config");

// Configure Express
const app = express();

app.set("trust proxy", true);
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoUri);

// Routes
pub(app);
verify(app);

// Server start/stop
module.exports = app
  .listen(config.port, () => {
    console.log(`Auth Service listening at http://localhost:${config.port}`);
  })
  .on("close", async () => await mongoose.connection.close());
