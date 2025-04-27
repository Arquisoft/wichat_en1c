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

            // Get a question
            const questionData = await getQuestion();
            if (!questionData)
                return res.status(500).json({ error: 'Could not obtain question from service' });

            // Create data to be saved and sent
            const { correctOption, ...questionToSend } = questionData;

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
    async function getQuestion() {
        try {
            const serviceResponse = await axios.get(`${questionsServiceUrl}/question`);
            const questionData = serviceResponse.data;
            return questionData;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
};