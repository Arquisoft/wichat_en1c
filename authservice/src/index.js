// @ts-check
const express = require("express");
const {
  setupDefaultHandlers,
  connectDB,
  startServer,
  setupLogger,
} = require("@wichat_en1c/common");
const config = require("./config");

// Configure Express
const app = express();
app.set("trust proxy", true);
app.use(express.json());
setupLogger(app, config.name);

// Routes
require("./routes/pub")(app);
require("./routes/verify")(app);

setupDefaultHandlers(app);

connectDB(config.mongoUri);
module.exports = startServer(app, config.port);
