// Modules
const axios = require('axios');
const cache = require("../cache");

module.exports = (app) => {

    const llmServiceUrl = process.env.LLM_SERVICE_URL || 'http://localhost:8005';

    // Endpoints
    app.post('/game/hint', async (req, res) => {
        // Get the username
        const { username } = req.body;
        if (!username)
            return res.status(400).json({ error: 'Username must be sent' });

        // Get the query
        const { query } = req.body;
        if (!query)
            return res.status(400).json({ error: 'Query must be sent' });

        // Get current question data
        const questionData = cache.getCurrentQuestionData(username);

        // Check if hints were generated before
        let hintsPromptText = "";
        if (questionData.hints.length > 0)
            hintsPromptText = `The hint must be different from these hints: ${questionData.hints.join(", ")}`;

        // Create prompt
        const prompt =
            `
        You are helping a user in a test question game. This is the current question:
        Question: ${questionData.question}
        Options: ${questionData.options.join(", ")}
        Correct option: ${questionData.correctAnswer}
        The user has asked for a hint: "${query}"
        ${hintsPromptText} 
        Please, generate a hint to help the user without telling the answer directly.
        `;

        // Send prompt to LLM Service
        try {
            // Ask LLM
            const serviceData = {
                question: prompt,
                model: "gemini"
            }
            const serviceResponse = await axios.post(`${llmServiceUrl}/ask`, serviceData);
            if (serviceResponse.status !== 210 || serviceResponse.data.success !== true)
                return res.status(500).json({ error: "Could not save game data" });

            // Return hint
            const answer = serviceResponse.data;
            cache.useHint(username, answer.answer)
            res.json(answer);
        } catch (error) {
            return res.status(500).json({ error: "There was an error when obtaining a hint" });
        }
    })
};  