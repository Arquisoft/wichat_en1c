// Modules
const config = require("./config");

// Cache with game data of all the current users playing
const cache = new Map();


module.exports = {
    addUser(username, gameConfig) {
        // Get current time
        const now = new Date().toISOString();

        // Get current game for user
        let userGame = cache.get(username);

        // If there`s no current game for user, create one
        if (!userGame) {
            cache.set(username, {
                username,
                game: {
                    time: {
                        started: now,
                        finished: null,
                    },
                    config: {
                        modes: gameConfig.modes,
                        rounds: gameConfig.rounds,
                        time: gameConfig.time,
                        hints: gameConfig.hints
                    },
                    hints: 0,
                    questions: []
                },
                usedHints: [],
                isAIGame: gameConfig.isAIGame
            });
        }
    },

    addQuestion(username, questionData) {
        // Get current time
        const now = new Date().toISOString();

        // Get current game for user
        let userGame = cache.get(username);

        // Save new question data 
        userGame.game.questions.push({
            time: {
                started: now,
                finished: null,
            },
            question: questionData.question,
            image: questionData.image,
            answers: {
                opts: questionData.options,
                selected: null,
                correct: questionData.options.indexOf(questionData.correctAnswer),
            },
        });
    },

    answer(username, selectedAnswer) {
        // Get current game for user
        const userGame = cache.get(username);
        if (!userGame || userGame.game.questions.length === 0)
            throw new Error('Could not save answer for user');

        // Get current question and its options
        const currentQuestion = userGame.game.questions[userGame.game.questions.length - 1];
        const questionOptions = currentQuestion.answers.opts;

        // Save answer data
        if (selectedAnswer != null)
            currentQuestion.answers.selected = questionOptions.indexOf(selectedAnswer);
        else
            currentQuestion.answers.selected = null;
        currentQuestion.time.finished = new Date().toISOString();
    },

    getUserCorrectAnswer(username) {
        // Get current game for user
        const userGame = cache.get(username);
        if (!userGame)
            throw new Error('Could not get correct answer of the question');

        // Get correct answer for the current question
        const currentQuestion = userGame.game.questions[userGame.game.questions.length - 1];
        const correctAnswer = currentQuestion.answers.opts[currentQuestion.answers.correct];
        return correctAnswer;
    },

    finishGame(username) {
        // Get current game for user
        const userGame = cache.get(username);
        if (!userGame)
            throw new Error('Could not finish game for the user');

        // Save finished game time
        userGame.game.time.finished = new Date().toISOString();

        // Remove used hints and AI option and get user game data to send
        const { usedHints, isAIGame, ...gameData } = userGame;

        // Delete data from cache
        cache.delete(username);

        // Return the user game data
        return gameData;
    },

    quitGame(username) {
        // Delete data from cache
        cache.delete(username);
    },

    getCurrentQuestionData(username) {
        // Get current game for user
        const userGame = cache.get(username);
        if (!userGame)
            throw new Error('Could not get current question data for the user');
        const currentQuestion = userGame.game.questions[userGame.game.questions.length - 1];
        const data = {
            question: currentQuestion.question,
            options: currentQuestion.answers.opts,
            correctAnswer:
                currentQuestion.answers.opts[currentQuestion.answers.correct],
            hints: userGame.usedHints,
        };
        return data;
    },

    useHint(username, hint) {
        // Get current game for user
        const userGame = cache.get(username);
        if (!userGame)
            throw new Error('Could not save used hint for the user');

        // Save hint in temporal cache
        userGame.game.hints++;
        userGame.usedHints.push(hint);
    },

    getRandomMode(username){
        // Get current game for user
        const userGame = cache.get(username);
        if (!userGame)
            throw new Error('Could not get modes from the user');
        const userModes = userGame.game.config.modes;
        const randomMode = userModes[Math.floor(Math.random() * userModes.length)];
        return randomMode;
    },

    isAIEnabledForUser(username){
        // Get current game for user
        const userGame = cache.get(username);
        if (!userGame)
            throw new Error('Could not get AI enabled from the user');
        const isAIEnabledUser = userGame.game.isAIGame;
        return isAIEnabledUser;
    }

};