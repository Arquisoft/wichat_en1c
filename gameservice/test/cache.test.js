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

  test("should not add existing user with correct game config", () => {
    const gameConfig1 = {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: 5,
      time: 30,
      hints: 3,
      isAIGame: false,
    };
    const gameConfig2 = {
      modes: ["musician", "scientist", "actor"],
      rounds: 6,
      time: 60,
      hints: 2,
      isAIGame: false,
    };
    const username = "username";

    cache.addUser(username, gameConfig1);

    let userGame = cache.getCache().get(username);
    expect(userGame).toBeTruthy();
    expect(userGame.username).toBe(username);
    expect(userGame.game.config.modes).toEqual(gameConfig1.modes);

    cache.addUser(username, gameConfig2);

    userGame = cache.getCache().get(username);
    expect(userGame).toBeTruthy();
    expect(userGame.username).toBe(username);
    expect(userGame.game.config.modes).toEqual(gameConfig1.modes);
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

  test("should throw error if non stored user answers", () => {
    const username = "username";

    expect(() => {
      cache.answer(username, "France");
    }).toThrow("Could not save answer for user");
  });

  test("should store unanswered for the current question", () => {
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

    cache.answer(username, null);

    const userGame = cache.getCache().get(username);
    expect(userGame.game.questions[0].answers.selected).toBe(null);
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

  test("should throw error if non stored user finishes game", () => {
    const username = "username";

    expect(() => {
      cache.finishGame(username);
    }).toThrow("Could not finish game for the user");
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

  test("should throw error if non stored user gets current data", () => {
    const username = "username";

    expect(() => {
      cache.getCurrentQuestionData(username);
    }).toThrow("Could not get current question data for the user");
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

  test("should throw error if non stored user uses hint", () => {
    const username = "username";
    const hint = "Hint";
    expect(() => {
      cache.useHint(username, hint);
    }).toThrow("Could not save used hint for the user");
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

  test("should throw error if non stored user gets random mode", () => {
    const username = "username";

    expect(() => {
      cache.getRandomMode(username);
    }).toThrow("Could not get modes from the user");
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

  test("should throw error if non stored user gets AI enabled option", () => {
    const username = "username";

    expect(() => {
      cache.isAIEnabledForUser(username);
    }).toThrow("Could not get AI enabled from the user");
  });
});