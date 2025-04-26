// Modules
const express = require('express');
const config = require("./config");
const ask = require("./routes/ask");

// Load enviornment variables
require('dotenv').config();

// Express
const app = express();
app.use(express.json());

// Routes
ask(app);

// Server
const server = app.listen(config.port, () => {
  console.log(`LLM Service listening at http://localhost:${config.port}`);
});

module.exports = server