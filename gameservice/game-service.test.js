const request = require("supertest");

let app;
const dependencies = [];

// TODO: Mock question-service
// Flaky test
beforeAll(async () => {
  // Run dependents
  dependencies.push(require("../questionservice/question-service"));

  // Run app
  app = require("./game-service");
});

afterAll(async () => {
  dependencies.forEach((dependent) => dependent.close());
  app.close();
});

test("should return game configuration values", async () => {
  const response = await request(app).get("/config");

  expect(response.status).toBe(200);
  expect(response.body.time).toBe(20);
  expect(response.body.rounds).toBe(3);
  expect(response.body.hints).toBe(3);
});

test("should return a valid question", async () => {
  const response = await request(app).get("/question");

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("question");
  expect(response.body.question).toBeTruthy();
}, 10_000);

test("should return 400 if an answer is not sent", async () => {
  const response = await request(app).post("/answer").send({});

  expect(response.status).toBe(400);
});

test("should return valid answer data if an answer is sent", async () => {
  const response = await request(app)
    .post("/answer")
    .send({ selectedAnswer: "answer" });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("correctAnswer");
  expect(response.body).toHaveProperty("isCorrect");
  expect(response.body.correctAnswer).toBeTruthy();
  expect(response.body.isCorrect).toBe(false);
});
