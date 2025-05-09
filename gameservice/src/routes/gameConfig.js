const config = require("../config");
const cache = require("../cache");

let custom = false;

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
        custom = true;
        cache.addUser(username, gameConfig);
        return res.status(200).send();
    });

    app.post('/game/config', async (req, res) => {
        // Get the username
        const { username, isAIGame } = req.body;
        if (!username)
            return res.status(400).json({ error: 'Username must be sent' });

        let userConfig = {
            time: undefined,
            rounds: undefined,
            hints: undefined,
            modes: undefined,
            isAIGame: undefined
        };
        if (custom) {
            userConfig = cache.getUserConfig(username);
            custom = false;
        }

        cache.quitGame(username); // KEEP THIS
        
        userConfig.time = userConfig.time ? userConfig.time : config.time;
        userConfig.rounds = userConfig.rounds ? userConfig.rounds : config.rounds;
        userConfig.hints = (userConfig.hints || userConfig.hints === 0) ? userConfig.hints : config.hints;
        userConfig.modes = userConfig.modes ? userConfig.modes : config.modes;

        if (isAIGame != undefined && isAIGame) {
            userConfig.isAIGame = isAIGame;
        }else{
            userConfig.isAIGame = config.isAIGame;
        }
        
        cache.addUser(username, userConfig);

        res.json({
            time: userConfig.time,
            rounds: userConfig.rounds,
            hints: userConfig.hints
        });
    });
};