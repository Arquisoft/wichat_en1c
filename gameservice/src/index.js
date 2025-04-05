// Modules
const express = require('express');

const config = require("./config");
const gameConfig = require("./routes/gameConfig");
const question = require('./routes/question');
const save = require('./routes/save');

// Express 
const app = express();
app.use(express.json());

// Routes
gameConfig(app);
question(app);
save(app);

// Server
const server = app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
});

module.exports = server;