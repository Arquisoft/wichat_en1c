const request = require("supertest");
const cache = require("../src/cache");
const crypto = require("crypto");

jest.mock("crypto", () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from([0]))
}));

describe("cache.js tests", () => {

  beforeEach(() => {
    cache.getCache().clear();
  });

  test("should add new user with correct game config", () => {
    const gameConfig = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: false,
    };
    const username = "username";

    cache.addUser(username, gameConfig);

    const userGame = cache.getCache().get(username);
    expect(userGame).toBeTruthy();
    expect(userGame.username).toBe(username);
    expect(userGame.game.config.modes).toEqual(gameConfig.modes);
  });

  test("should add question to the user game", () => {
    const username = "username";
    const gameConfig = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: false,
    };
    cache.addUser(username, gameConfig);

    const questionData = {
      question: "Where is Madrid?",
      image: "image",
      options: ["Spain", "France", "Italy", "Belgium"],
      correctAnswer: "Spain"
    };

    cache.addQuestion(username, questionData);

    const userGame = cache.getCache().get(username);
    expect(userGame.game.questions).toHaveLength(1);
    expect(userGame.game.questions[0].question).toBe(questionData.question);
  });

  test("should store selected option for the current question", () => {
    const username = "username";
    const gameConfig = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: false,
    };
    cache.addUser(username, gameConfig);

    const questionData = {
      question: "Where is Madrid?",
      image: "image",
      options: ["Spain", "France", "Italy", "Belgium"],
      correctAnswer: "Spain"
    };
    cache.addQuestion(username, questionData);

    cache.answer(username, "France");

    const userGame = cache.getCache().get(username);
    expect(userGame.game.questions[0].answers.selected).toBe(1); 
    expect(userGame.game.questions[0].time.finished).toBeTruthy();
  });

  test("should return the correct answer for the current question", () => {
    const username = "username";
    const gameConfig = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: false,
    };
    cache.addUser(username, gameConfig);

    const questionData = {
      question: "Where is Madrid?",
      image: "image",
      options: ["Spain", "France", "Italy", "Belgium"],
      correctAnswer: "Spain"
    };
    cache.addQuestion(username, questionData);

    const correctAnswer = cache.getUserCorrectAnswer(username);
    expect(correctAnswer).toBe("Spain");
  });

  test("should end the game and return game data", () => {
    const username = "username";
    const gameConfig = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: false,
    };
    cache.addUser(username, gameConfig);

    const questionData = {
      question: "Where is Madrid?",
      image: "image",
      options: ["Spain", "France", "Italy", "Belgium"],
      correctAnswer: "Spain"
    };
    cache.addQuestion(username, questionData);

    cache.finishGame(username);

    expect(cache.getCache().has(username)).toBe(false); 
  });

  test("should remove user game data from cache", () => {
    const username = "username";
    const gameConfig = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: false,
    };
    cache.addUser(username, gameConfig);

    cache.quitGame(username);

    expect(cache.getCache().has(username)).toBe(false);
  });

  test("should return current question data for the user", () => {
    const username = "username";
    const gameConfig = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: false,
    };
    cache.addUser(username, gameConfig);

    const questionData = {
      question: "Where is Madrid?",
      image: "image",
      options: ["Spain", "France", "Italy", "Belgium"],
      correctAnswer: "Spain"
    };
    cache.addQuestion(username, questionData);

    const currentQuestionData = cache.getCurrentQuestionData(username);
    expect(currentQuestionData.question).toBe(questionData.question);
    expect(currentQuestionData.correctAnswer).toBe(questionData.correctAnswer);
  });

  test("should add a hint to the user game", () => {
    const username = "username";
    const gameConfig = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: false,
    };
    cache.addUser(username, gameConfig);

    const hint = "Hint";
    cache.useHint(username, hint);

    const userGame = cache.getCache().get(username);
    expect(userGame.game.hints).toBe(1);
    expect(userGame.usedHints).toContain(hint);
  });

  test("should return a random mode for the user", () => {
    const username = "username";
    const gameConfig = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: false,
    };
    cache.addUser(username, gameConfig);

    // Random value is mocked
    const randomMode = cache.getRandomMode(username);
    expect(randomMode).toBe("musician");
  });

  test("should return true isAIGame is true", () => {
    const username = "username";
    const gameConfig = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: true,
    };
    cache.addUser(username, gameConfig);

    const isAIEnabled = cache.isAIEnabledForUser(username);
    expect(isAIEnabled).toBe(true);
  });

  test("should return false isAIGame is false", () => {
    const username = "username";
    const gameConfig = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: false,
    };
    cache.addUser(username, gameConfig);

    const isAIEnabled = cache.isAIEnabledForUser(username);
    expect(isAIEnabled).toBe(false);
  });
});