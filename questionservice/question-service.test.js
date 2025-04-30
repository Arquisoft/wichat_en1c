jest.setTimeout(80000); // 40 seconds to 80 seconds update because sometimes retriving data takes longer due to new test scenerios

const request = require("supertest");
const { server, formatWikidataDate, app } = require("./question-service");
describe("Question API", () => {

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test("should return a correctly formatted date (DD/MM/YYYY)", async () => {
    const testDate = "2023-05-15T00:00:00Z";
    const result = formatWikidataDate(testDate);
    
    expect(result).toBe("15/05/2023"); 
  });


  test('should return a error 400 when wrong category', async () => {
    
    const res = await request(app)
      .get('/question/error-category') 
      .expect(400);
    
    expect(res.body).toHaveProperty('error');
  });

  test("GET /question - should return a question", async () => {
    const res = await request(server).get("/question");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("question_en");
    expect(res.body).toHaveProperty("question_es");
    expect(res.body).toHaveProperty("image");
    expect(res.body).toHaveProperty("options");
    expect(res.body.options.length).toBe(4);
    expect(res.body).toHaveProperty("correctAnswer");
  });

  const categories = ['musician', 'scientist', 'actor', 'painter', 'writer'];

  categories.forEach((category) => {
    test(`GET /question/${category} - should return a question from category ${category}`, async () => {
      const res = await request(server).get(`/question/${category}`);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("question_en");
        expect(res.body).toHaveProperty("question_es");
        expect(res.body).toHaveProperty("image");
        expect(res.body).toHaveProperty("options");
        expect(res.body.options.length).toBe(4);
        expect(res.body).toHaveProperty("correctAnswer");
        expect(res.body.category).toBe(category);
      } else {
       
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
