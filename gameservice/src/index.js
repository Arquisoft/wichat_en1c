// Modules
const express = require('express');

const config = require("./config");
const gameConfig = require("./routes/gameConfig");

// Express 
const app = express();

app.use(express.json());

// Routes
gameConfig(app);

// Server
const server = app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
});

module.exports = server;