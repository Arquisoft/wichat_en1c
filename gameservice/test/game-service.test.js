const request = require("supertest");
const axios = require("axios");
const cache = require("../src/cache");
const config = require("../src/config");

jest.mock("axios");
jest.mock("../src/cache");

let app;
beforeAll(() => {
  app = require("../src/index");
});

afterAll(async () => {
  await app.close();
});

// CONFIG
describe("config.js", () => {
  test("should have correct config values", () => {
    expect(config).toEqual({
      port: config.port,
      time: config.time,
      rounds: config.rounds,
      hints: config.hints,
      modes: config.modes
    });
  });
});

// QUESTION
describe("/game/question", () => {
  beforeEach(() => {
    axios.get.mockReset();
    cache.addQuestion.mockReset();
  });

  test("should return valid question", async () => {
    const mockQuestion = {
      question: "Where is Madrid?",
      options: ["Spain", "France", "Italy", "Belgium"],
      correctOption: "Spain",
      image: "image.png",
    };

    axios.get.mockResolvedValueOnce({ data: mockQuestion });

    cache.addQuestion.mockImplementationOnce(() => { });

    const response = await request(app)
      .get("/game/question")
      .send({ username: "user" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      question: "Where is Madrid?",
      options: ["Spain", "France", "Italy", "Belgium"],
      image: "image.png",
    });

    expect(cache.addQuestion).toHaveBeenCalledWith("user", {
      question: "Where is Madrid?",
      options: ["Spain", "France", "Italy", "Belgium"],
      correctOption: "Spain",
      image: "image.png",
    });
  });

  test("should return 400 if username is not sent", async () => {
    const response = await request(app).get("/game/question").send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Username must be sent");
  });

  test("should return 500 if getQuestion() catches error", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error obtaining question"));

    const response = await request(app)
      .get("/game/question")
      .send({ username: "user" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("There was an error when obtaining the question");
  });

  test("should return 500 if getQuestion() returns null", async () => {
    axios.get.mockResolvedValueOnce({ data: null });

    const response = await request(app)
      .get("/game/question")
      .send({ username: "user" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Could not obtain question from service");
  });
});

// ANSWER
describe("/game/answer", () => {
  beforeEach(() => {
    cache.getUserCorrectAnswer.mockReset();
    cache.answer.mockReset();
  });

  test("should return 400 if username is not sent", async () => {
    const response = await request(app)
      .post("/game/answer")
      .send({ selectedAnswer: "Spain" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Username must be sent");
  });

  test("should return that answer is incorrect if selected answer is not sent", async () => {
    cache.getUserCorrectAnswer.mockResolvedValueOnce("Spain");
    cache.answer.mockImplementationOnce(() => {});

    const response = await request(app)
      .post("/game/answer")
      .send({ username: "user" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      correctAnswer: "Spain",
      isCorrect: false,
    });

    expect(cache.answer).toHaveBeenCalledWith("user", null);
  });

  test("should return that answer is correct if selected answer is equal to correct answer", async () => {
    cache.getUserCorrectAnswer.mockResolvedValueOnce("Spain");
    cache.answer.mockImplementationOnce(() => { });

    const response = await request(app)
      .post("/game/answer")
      .send({ username: "user", selectedAnswer: "Spain" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      correctAnswer: "Spain",
      isCorrect: true,
    });

    expect(cache.answer).toHaveBeenCalledWith("user", "Spain");
  });

  test("should return that answer is incorrect if selected answer is not equal to correct answer", async () => {
    cache.getUserCorrectAnswer.mockResolvedValueOnce("Spain");
    cache.answer.mockImplementationOnce(() => { });

    const response = await request(app)
      .post("/game/answer")
      .send({ username: "user", selectedAnswer: "France" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      correctAnswer: "Spain",
      isCorrect: false,
    });

    expect(cache.answer).toHaveBeenCalledWith("user", "France");
  });

  test("should return that answer is incorrect if selected answer is null", async () => {
    cache.getUserCorrectAnswer.mockResolvedValueOnce("Spain");
    cache.answer.mockImplementationOnce(() => {});

    const response = await request(app)
      .post("/game/answer")
      .send({ username: "user", selectedAnswer: null });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      correctAnswer: "Spain",
      isCorrect: false,
    });

    expect(cache.answer).toHaveBeenCalledWith("user", null);
  });

  test("should return 500 if cache.getUserCorrectAnswer() throws error", async () => {
    cache.getUserCorrectAnswer.mockRejectedValueOnce(
      new Error("Could not get correct answer of the question")
    );

    const response = await request(app)
      .post("/game/answer")
      .send({ username: "user", selectedAnswer: "Spain" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "Could not get correct answer of the question"
    );
  });

  test("should return 500 if cache.answer() throws error", async () => {
    cache.getUserCorrectAnswer.mockResolvedValueOnce("Spain");
    cache.answer.mockImplementationOnce(() => {
      throw new Error("Could not save answer for user");
    });

    const response = await request(app)
      .post("/game/answer")
      .send({ username: "user", selectedAnswer: "Spain" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Could not save answer for user");
  });
});

// SAVE
describe("/game/save", () => {
  test("should return 400 if username is not sent", async () => {
    const response = await request(app).post("/game/save").send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Username must be sent");
  });

  test("should return 500 if cache.finishGame() throws an error", async () => {
    cache.finishGame.mockImplementationOnce(() => {
      throw new Error("Could not finish game for the user");
    });

    const response = await request(app)
      .post("/game/save")
      .send({ username: "user" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Could not finish game for the user");
  });

  test("should return 500 if Stats Service returns error", async () => {
    cache.finishGame.mockImplementationOnce(() => ({}));

    axios.post.mockResolvedValueOnce({
      status: 404,
      data: { success: false },
    });

    const response = await request(app)
      .post("/game/save")
      .send({ username: "user" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Could not save game data");
  });
});

// HINT
describe("/game/hint", () => {
  test("should return 400 if username is not sent", async () => {
    const response = await request(app)
      .post("/game/hint")
      .send({ query: "Give me a hint" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Username must be sent");
  });

  test("should return 400 if query is not sent", async () => {
    const response = await request(app)
      .post("/game/hint")
      .send({ username: "user" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Query must be sent");
  });

  test("should return 500 if cache.getCurrentQuestionData() throws error", async () => {
    cache.getCurrentQuestionData.mockImplementationOnce(() => {
      throw new Error("Could not get current question data for the user");
    });

    const response = await request(app)
      .post("/game/hint")
      .send({ username: "user", query: "Give me a hint" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "Could not get current question data for the user"
    );
  });

  test("should return 500 if LLM service does not return 200", async () => {
    cache.getCurrentQuestionData.mockReturnValue({
      question: "Where is Madrid?",
      options: ["Spain", "France", "Italy", "Belgium"],
      correctAnswer: "Spain",
      hints: [],
    });

    axios.post.mockResolvedValueOnce({
      status: 500,
      data: {},
    });

    const response = await request(app)
      .post("/game/hint")
      .send({ username: "user", query: "Give me a hint" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Could not get hint from LLM");
  });

  test("should return 500 if LLM Service throws error", async () => {
    cache.getCurrentQuestionData.mockReturnValue({
      question: "Where is Madrid?",
      options: ["Spain", "France", "Italy", "Belgium"],
      correctAnswer: "Spain",
      hints: [],
    });

    axios.post.mockRejectedValueOnce(new Error("LLM Error"));

    const response = await request(app)
      .post("/game/hint")
      .send({ username: "user", query: "Give me a hint" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "There was an error when obtaining a hint"
    );
  });
});
