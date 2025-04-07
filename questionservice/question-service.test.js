jest.setTimeout(60_000); // If I make 5 seconds, it is not enough to retrive data from wikidata api

const request = require("supertest");
const server = require("./question-service");

describe("Question API", () => {
  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test("GET /question - should return a question", async () => {
    const res = await request(server).get("/question");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("question");
    expect(res.body).toHaveProperty("image");
    expect(res.body).toHaveProperty("options");
    expect(res.body.options.length).toBe(4);
    expect(res.body).toHaveProperty("correctAnswer");
  });

  const categories = ["musician", "scientist", "actor", "painter", "writer"];

  categories.forEach((category) => {
    test(`GET /question/${category} - should return a question from category ${category}`, async () => {
      const res = await request(server).get(`/question/${category}`);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("question");
        expect(res.body).toHaveProperty("image");
        expect(res.body).toHaveProperty("options");
        expect(res.body.options.length).toBe(4);
        expect(res.body).toHaveProperty("correctAnswer");
        expect(res.body.category).toBe(category);
      } else {
        // Eğer veri Wikidata'dan gelmiyorsa geçici olarak 503 olabilir
        expect(res.statusCode).toBe(503);
        expect(res.body).toHaveProperty("error");
      }
    });
  });

  test("GET /question/invalid - should return 400 for invalid category", async () => {
    const res = await request(server).get("/question/invalid");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
