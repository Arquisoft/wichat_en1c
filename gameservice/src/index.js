// Modules
const express = require('express');

const {
    setupDefaultHandlers,
    startServer,
    setupLogger,
} = require("@wichat_en1c/common");

const pkg = require("../package.json");

const config = require("./config");
const gameConfig = require("./routes/gameConfig");
const question = require('./routes/question');
const save = require('./routes/save');
const hint = require('./routes/hint')

// Express 
const app = express();
app.set("trust proxy", true);

setupLogger(app, `${pkg.name}@${pkg.version}`);
app.use(express.json());

// Routes
gameConfig(app);
question(app);
save(app);
hint(app);

setupDefaultHandlers(app);

// Server
module.exports = startServer(app, config.port);