const config = require("../config");

module.exports = (app) => {

    app.get('/game/config', async (req, res) => {
        const gameConfig = {
            port: config.port,
            time: config.time,
            rounds: config.rounds,
            hints: config.hints
        }
        res.json(gameConfig);
    });

};