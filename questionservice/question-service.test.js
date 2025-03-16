const request = require("supertest");
const app = require("./question-service");

test("Test musicians endpoint", async () => {
  const response = await request(app).get("/musicians");

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("question");
  expect(response.body).toHaveProperty("image");
  expect(response.body).toHaveProperty("options");
  expect(response.body).toHaveProperty("musicianName");
});
