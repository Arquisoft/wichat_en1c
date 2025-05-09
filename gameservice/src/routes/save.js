// Modules
const axios = require('axios');
const cache = require("../cache");

module.exports = (app) => {

    const statsServiceUrl = process.env.STATS_SERVICE_URL || 'http://localhost:8003';

    // Endpoints
    app.post('/game/save', async (req, res) => {
        // Get the username
        const { username } = req.body;
        if (!username)
            return res.status(400).json({ error: 'Username must be sent' });

        // Finish user's game and get the game data
        let userData;
        try {
            userData = cache.finishGame(username);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

        // Send data to Statistics Service to be sent
        try {
            const serviceResponse = await axios.post(`${statsServiceUrl}/save`, userData);
            if (serviceResponse.status !== 201 || serviceResponse.data.success !== true)
                return res.status(500).json({ error: "Could not save game data" });
        } catch (error) {
            req.log.error(error, "statistic service request error");
        }

        return res.status(200).send();
    })
};  