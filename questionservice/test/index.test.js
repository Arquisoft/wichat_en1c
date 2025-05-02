const request = require("supertest");
const config = require("../src/config");

config.initialRefill = false; // Disable initial refill to improve control over the cache
config.wikidataUrl = "http://localhost:9997"; // Mocked URL for testing

/**
 * @type {import("http").Server}
 */
let server, wikidataMockServer;

beforeAll(() => {
  // Run servers
  wikidataMockServer = require("./mockWikidata");
  server = require("../src");
});

afterAll(() => {
  server.close(() => wikidataMockServer.close());
});

it("Should return a question on the fly", async () => {
  const response = await request(server).get("/question").send();
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("question_en");
  expect(response.body).toHaveProperty("question_es");
  expect(response.body).toHaveProperty("image");
  expect(response.body).toHaveProperty("options");
  expect(response.body.options.length).toBe(4);
  expect(response.body).toHaveProperty("correctAnswer");
  expect(response.body).toHaveProperty("category");
});

it("Should return a question from cache", async () => {
  const response = await request(server).get("/question").send();
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("question_en");
  expect(response.body).toHaveProperty("question_es");
  expect(response.body).toHaveProperty("image");
  expect(response.body).toHaveProperty("options");
  expect(response.body.options.length).toBe(4);
  expect(response.body).toHaveProperty("correctAnswer");
  expect(response.body).toHaveProperty("category");
});

it("Should return a question from a specific category", async () => {
  const categories = Object.getOwnPropertyNames(config.categories);
  for (const category of categories) {
    const response = await request(server).get(`/question/${category}`).send();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("question_en");
    expect(response.body).toHaveProperty("question_es");
    expect(response.body).toHaveProperty("image");
    expect(response.body).toHaveProperty("options");
    expect(response.body.options.length).toBe(4);
    expect(response.body).toHaveProperty("correctAnswer");
    expect(response.body.category).toBe(category);
  }
});

it("Should return 400 for invalid category", async () => {
  const response = await request(server).get("/question/invalid").send();
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toBe("Invalid category");
});

it("Should reject invalid routes", async () => {
  const response = await request(server).get("/nonexistent").send();

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe("Not Found");
});
