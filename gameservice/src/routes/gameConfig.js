const config = require("../config");
const cache = require("../cache");

module.exports = (app) => {

    app.post('/game/custom', async (req, res) => {
        // Get the username
        const { username } = req.body;
        if (!username)
            return res.status(400).json({ error: 'Username must be sent' });

        cache.quitGame(username); // KEEP THIS
        const { rounds, time, hints, isAIGame, categories } = req.body;
        const gameConfig = {
            time: time,
            rounds: rounds,
            hints: hints,
            modes: categories.length > 0 ? categories : config.modes,
            isAIGame: isAIGame
        };
        cache.addUser(username, gameConfig);
        return res.status(200);
    });

    app.get('/game/config', async (req, res) => {
        // Get the username
        const { username } = req.body;
        if (!username)
            return res.status(400).json({ error: 'Username must be sent' });

        cache.quitGame(username); // KEEP THIS
        const gameConfig = {
            time: config.time,
            rounds: config.rounds,
            hints: config.hints,
            modes: config.modes,
            isAIGame: false
        }
        cache.addUser(username, gameConfig);
        res.json({
            time: gameConfig.time,
            rounds: gameConfig.rounds,
            hints: gameConfig.hints
        });
    });
};