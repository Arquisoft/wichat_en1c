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
        let questionData;
        try {
            questionData = cache.getCurrentQuestionData(username);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

        // Check if hints were generated before
        let hintsPromptText = "";
        if (questionData.hints.length > 0)
            hintsPromptText = `The hint must be different from these hints: ${questionData.hints.join(", ")}`;

        // Create prompt
        const prompt =
            `
        You are helping a user in a test question game. This is the current question details:
        Question: ${questionData.question}
        Options: ${questionData.options.join(", ")}
        Correct option: ${questionData.correctAnswer}
        The user has made the following question in order to get a hint: "${query}"
        ${hintsPromptText} 
        Please, generate a response for the user's question to give the user a hint that is not the correct answer to the question directly. 
        Please, answer in the same language as the question.
        The hint must be a single word or a short sentence, without any other information.
        `;

        // Send prompt to LLM Service
        try {
            // Ask LLM
            const serviceData = {
                question: prompt
            }
            const serviceResponse = await axios.post(`${llmServiceUrl}/ask`, serviceData);
            if (serviceResponse.status !== 200)
                return res.status(500).json({ error: "Could not get hint from LLM" });


            // Return hint
            const hint = serviceResponse.data.answer;

            try {
                cache.useHint(username, hint);
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }

            res.json({ hint });
        } catch (error) {
            req.log.error(error, "hint obtaining error");
            return res.status(500).json({ error: "There was an error when obtaining a hint" });
        }
    })
};  