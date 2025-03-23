// @ts-check
const express = require("express");
const mongoose = require("mongoose");

const save = require("./routes/save");
const config = require("./config");

// Configure Express
const app = express();

app.set("trust proxy", true);
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoUri);

// Routes
save(app);

// Server start/stop
module.exports = app
  .listen(config.port, () => {
    console.log(
      `Statistics Service listening at http://localhost:${config.port}`
    );
  })
  .on("close", async () => await mongoose.connection.close());
