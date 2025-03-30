// @ts-check
const express = require("express");
const mongoose = require("mongoose");

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

// Server start/stop
module.exports = app
  .listen(config.port, () => {
    console.log(
      `Statistics Service listening at http://localhost:${config.port}`
    );
  })
  .on("close", async () => await mongoose.connection.close());
