const request = require("supertest");

let app;
const dependencies = [];

beforeAll(async () => {
  // Run app
  app = require("./question-service");
});

afterAll(async () => {
  app.close();
});

test("Test musicians endpoint", async () => {
  const response = await request(app).get("/musicians");

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("question");
  expect(response.body).toHaveProperty("image");
  expect(response.body).toHaveProperty("options");
  expect(response.body).toHaveProperty("musicianName");
}, 10_000);
