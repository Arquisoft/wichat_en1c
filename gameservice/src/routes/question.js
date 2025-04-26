// Modules
const axios = require('axios');
const cache = require("../cache");

module.exports = (app) => {

    const questionsServiceUrl = process.env.QUESTIONS_SERVICE_URL || 'http://localhost:8004';

    // Endpoints
    app.get('/game/question', async (req, res) => {
        try {
            // Get the username
            const { username } = req.body;
            if (!username)
                return res.status(400).json({ error: 'Username must be sent' });

            // Get random mode for the question
            let questionMode;
            try {
                questionMode = cache.getRandomMode(username);
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }

            // Get a question
            const questionData = await getQuestion(questionMode);
            if (!questionData)
                return res.status(500).json({ error: 'Could not obtain question from service' });

            // Create data to be saved and sent
            const { correctOption, ...questionToSend } = questionData;

            // If AI mode enabled, ask the AI for its answer
            let isAIEnabled;
            try {
                isAIEnabled = await cache.isAIEnabledForUser(username);
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }

            let answerAI;
            if (isAIEnabled) {
                const { image, ...questionForAI } = questionToSend;
                answerAI = await askAIAnswer(questionForAI);
                if (!answerAI)
                    return res.status(500).json({ error: 'Could not obtain answer from AI' });
                questionToSend.answerAI = answerAI;
            }

            // Save generated question data for user
            cache.addQuestion(username, questionData);

            // Send question data for the frontend
            res.json(questionToSend);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'There was an error when obtaining the question' });
        }
    });

    app.post('/game/answer', async (req, res) => {
        try {
            // Get the username
            const { username } = req.body;
            if (!username)
                return res.status(400).json({ error: 'Username must be sent' });

            // Get the selected answer
            const { selectedAnswer } = req.body;
            if (!selectedAnswer)
                return res.status(400).json({ error: 'Selected answer must be sent' });

            // Check if answer is correct
            let correctAnswer;
            try {
                correctAnswer = await cache.getUserCorrectAnswer(username);
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }

            const isCorrect = selectedAnswer === correctAnswer;
            const result = {
                correctAnswer: correctAnswer,
                isCorrect: isCorrect
            }

            // Save answered question data for user
            try {
                cache.answer(username, selectedAnswer);
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }

            // Send answer result data for the frontend
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'There was an error when checking the answer' });
        }
    });


    // Functions
    async function getQuestion(questionMode) {
        try {
            const serviceResponse = await axios.get(`${questionsServiceUrl}/question/${questionMode}`);
            const questionData = serviceResponse.data;
            return questionData;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function askAIAnswer(questionForAI) {
        const prompt =
            `
        You are playing against a person in a test question game. This is the current question details:
        Question: ${questionForAI.question}
        Options: ${questionForAI.options.join(", ")}
        Please, try to answer only the selected option like an average person, take into account that you can fail or not. Answer based
        on the difficulty the question has and decide if you say it right or not.
        `;
        try {
            // Ask LLM
            const serviceData = {
                question: prompt
            }

            const serviceResponse = await axios.post(`${llmServiceUrl}/ask`, serviceData);
            if (serviceResponse.status !== 200)
                return res.status(500).json({ error: "Could not get hint from LLM" });

            // Return answer
            const answerAI = serviceResponse.data.answer;
            return answerAI;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
};