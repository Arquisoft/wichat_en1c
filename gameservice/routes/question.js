const questionsServiceUrl = process.env.QUESTIONS_SERVICE_URL || 'http://localhost:8004';

let correctAnswer = null;


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

app.get('/question', async(req, res) => {
    try{
        const question = await getQuestion();

        if(!question)
            return res.status(500).json({error: 'Could not obtain question from service'});

        res.json(question);
    }catch(error){
        res.status(500).json({error: 'There was an error when obtaining the question'});
    }
});

app.post('/answer', async(req, res) => {
    try{
        if(!correctAnswer)
            return res.status(500).json({error: 'There was an error obtaining the correct answer'});

        const {selectedAnswer} = req.body;

        if(!selectedAnswer)
            return res.status(400).json({error: 'Selected answer must be sent'});

        const isCorrect = selectedAnswer === correctAnswer;

        const result = {
            correctAnswer: correctAnswer,
            isCorrect: isCorrect
        }

        res.json(result);
    }catch(error){
        res.status(500).json({error: 'There was an error when checking the answer'});
    }
});