const express = require('express');
const axios = require('axios');

const app = express();
const port = 8001;

app.use(express.json());

const questionsServiceUrl = process.env.QUESTIONS_SERVICE_URL || 'http://localhost:8004';

let correctAnswer = null;

// Functions
async function getQuestion(){
    try{
        const serviceResponse = await axios.get(`${questionsServiceUrl}/musicians`);
        const {musicianName, ...questionData} = serviceResponse.data;

        correctAnswer=musicianName;
        return questionData;
    }catch(error){
        console.error('Error when obtaining the question: ', error);
        return null;
    }
}

// Endpoints
app.get('/game/question', async(req, res) => {
    try{
        const question = await getQuestion();
        res.json(question);
    }catch(error){
        res.status(500).json({error: 'There was an error when obtaining the question'});
    }
});

app.post('/game/answer', async(req, res) => {
    const {selectedAnswer} = req.body;

    const isCorrect = selectedAnswer === correctAnswer;

    const result = {
        correctAnswer: correctAnswer,
        isCorrect: isCorrect
    }

    res.json(result);
});

app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`); 
});