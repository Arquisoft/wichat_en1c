// @ts-check

const express = require("express");
const {
  setupDefaultHandlers,
  startServer,
  setupLogger,
} = require("@wichat_en1c/common");

const pkg = require("../package.json");
const config = require("./config");
const { getQuestion, refillCache } = require("./cache");

// Configure express
const app = express();
app.set("trust proxy", true);
const logger = setupLogger(app, `${pkg.name}@${pkg.version}`);

// Routes

const categories = Object.getOwnPropertyNames(config.categories);
app.get("/question", async (req, res) => {
  res.json(
    await getQuestion(
      categories[Math.floor(Math.random() * categories.length)],
      req.log
    )
  );
});

app.get("/question/:category", async (req, res) => {
  // Validate category
  const { category } = req.params;
  if (!categories.includes(category)) {
    res.status(400).json({ success: false, error: "Invalid category" });
    return;
  }

  res.json(await getQuestion(category, req.log));
});

setupDefaultHandlers(app);

if (config.initialRefill)
  refillCache(...categories).catch((err) =>
    logger.error(err, "Error during initial refilling cache")
  );

module.exports = startServer(app, config.port);
