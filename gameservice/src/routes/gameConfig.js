const config = require("../config");
const cache = require("../cache");


module.exports = (app) => {

    app.get('/game/config', async (req, res) => {
        cache.quitGame(req.body.username); // KEEP THIS
        const gameConfig = {
            port: config.port,
            time: config.time,
            rounds: config.rounds,
            hints: config.hints
        }
        res.json(gameConfig);
    });

};