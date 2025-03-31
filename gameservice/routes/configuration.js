app.get('/config', async(req, res) => {
    const gameConfig = {
        time: 20,
        rounds: 3,
        hints: 3
    }
    res.json(gameConfig);
});