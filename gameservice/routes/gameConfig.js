const config = require("../config");

module.exports = (app) => {

    app.get('/config', async (req, res) => {
        const gameConfig = {
            time: config.time,
            rounds: config.rounds,
            hints: config.hints
        }
        res.json(gameConfig);
    });

};