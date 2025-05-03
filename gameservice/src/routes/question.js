// Modules
const axios = require('axios');
const cache = require("../cache");

module.exports = (app) => {

    const questionsServiceUrl = process.env.QUESTIONS_SERVICE_URL || 'http://localhost:8004';
    const llmServiceUrl = process.env.LLM_SERVICE_URL || 'http://localhost:8005';

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
            let questionToSend = {
                question: questionData.question,
                image: questionData.image,
                options: questionData.options,
                category: questionData.category,
                answerAI: undefined,
            };
          
            // If AI mode enabled, ask the AI for its answer
            let isAIEnabled;
            try {
                isAIEnabled = await cache.isAIEnabledForUser(username);
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }

            let AIanswer;
            if (isAIEnabled) {
                const { image, answerAI, ...questionForAI } = questionToSend;
                AIanswer = await askAIAnswer(questionForAI);
                if (!AIanswer)
                    return res.status(500).json({ error: 'Could not obtain answer from AI' });
                if(questionData.correctAnswer === AIanswer)
                    questionToSend.answerAI = true;
                else
                    questionToSend.answerAI = false;
            }

            // Save generated question data for user
            cache.addQuestion(username, questionData);

            // Send question data for the frontend
            res.json(questionToSend);
        } catch (error) {
            req.log.error(error, "question obtaining error");
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
                if (!selectedAnswer)
                    cache.answer(username, null);
                else
                    cache.answer(username, selectedAnswer);
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }

            // Send answer result data for the frontend
            res.json(result);
        } catch (error) {
            req.log.error(error, "question answering error");
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
            req.log.error(error, "question service request error");
            return null;
        }
    }

    async function askAIAnswer(questionForAI) {
        const prompt =
            `
        You are playing against a person in a test question game. Please, try to answer only the selected option. 
        This is the current question details: 
        Question: ${questionForAI.question}. 
        Options: ${questionForAI.options.join(", ")}. 
        Consider the difficulty of the question. If it seems hard for an average person, you are more likely to guess or choose an option 
        you are not entirely sure about. Evaluate your confidence in knowing the correct answer, you are an average person. 
        If your simulated confidence is low, there's a higher chance you might be wrong. Don't try to access external information, 
        just choose one option based on your simulated understanding and level of confidence. You must answer the correct one with a 40% of 
        probability and 60% of guessing wrong.
        `;
        try {
            // Ask LLM
            const serviceData = {
                question: prompt,
                model:"gemini"
            }

            const serviceResponse = await axios.post(`${llmServiceUrl}/ask`, serviceData);
            if (serviceResponse.status !== 200)
                return res.status(500).json({ error: "Could not get hint from LLM" });

            // Return answer
            const answerAI = serviceResponse.data.answer;
            return answerAI.replace(/\n/g, '');
        } catch (error) {
            req.log.error(error, "AI mode question answering error");
            return null;
        }
    }
};