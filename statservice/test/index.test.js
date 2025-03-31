// @ts-check

const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const config = require("../src/config");
const { User, Game, Question } = require("../src/model");
const {
  beforeAll,
  afterAll,
  describe,
  it,
  expect,
  beforeEach,
} = require("@jest/globals");

/**
 * @type {import("mongodb-memory-server").MongoMemoryServer}
 */
let mongoServer;
/**
 * @type {import("http").Server}
 */
let app;
let userId;

const date = new Date("2021-01-01");
const date2 = new Date("2021-01-01 00:00:15");

// Test data
const username = "testuser";
const game = {
  time: {
    started: date,
    finished: date2,
  },
  config: {
    mode: "musicians",
    rounds: 1,
    time: 100,
    hints: 3,
  },
  questions: [
    {
      time: {
        started: date,
        finished: date2,
      },
      image: "https://example.com/image.jpg",
      question: "Hola?",
      answers: {
        opts: ["1", "2"],
        selected: 0,
        correct: 1,
      },
    },
  ],
};
const expectedDbGame = {
  ...game,
  questions: [
    {
      time: {
        started: date,
        finished: date2,
      },
      question: {
        image: "https://example.com/image.jpg",
        question: "Hola?",
        answers: {
          opts: ["1", "2"],
          correct: 1,
        },
      },
      selected: 0,
    },
  ],
};

const expectedStats = {
  time: {
    total: 15000,
    game: { min: 15000, max: 15000, avg: 15000 },
    question: { min: 15000, max: 15000, avg: 15000 },
  },
  question: { passed: 0, failed: 1, total: 1 },
  game: { total: 1 },
};

beforeAll(async () => {
  // Create testing MongoDB server
  mongoServer = await MongoMemoryServer.create();
  config.mongoUri = mongoServer.getUri();

  // Run app
  app = require("../src");

  // Create test user
  userId = await User.insertOne({ username }).then((u) => u._id);
});

beforeEach(async () => {
  // Clear database
  await Promise.all([Game.deleteMany(), Question.deleteMany()]);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe("Save route", () => {
  it("Should perform a successful save", async () => {
    const response = await request(app).post("/save").send({ username, game });

    // Check response
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Created");

    // Check insertion
    const dbGame = await Game.findOne({ user: userId }).populate(
      "questions.question"
    );
    expect(dbGame?.toJSON()).toMatchObject(expectedDbGame);
  });

  it("Should reject non-existent usernames", async () => {
    const response = await request(app)
      .post("/save")
      .send({ username: "nonexistent", game });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Not Found");

    // Check not insertion
    const dbGame = await Game.findOne({ user: userId });
    expect(dbGame).toBeNull();
  });

  it("Should reject invalid games", async () => {
    const responses = await Promise.all([
      request(app)
        .post("/save")
        .send({ username, game: { ...game, time: {} } }),
      request(app)
        .post("/save")
        .send({ username, game: { ...game, config: {} } }),
      request(app)
        .post("/save")
        .send({ username, game: { ...game, questions: [] } }),
      request(app)
        .post("/save")
        .send({ username, game: { ...game, questions: [{}] } }),
      request(app)
        .post("/save")
        .send({ username, game: { ...game, questions: [{ answers: {} }] } }),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Bad Request");
      expect(response.body.errors).toBeDefined();
    }

    // Check not insertion
    const dbGame = await Game.findOne({ user: userId });
    expect(dbGame).toBeNull();
  });
});

describe("User stats route", () => {
  it("Should get user stats", async () => {
    await request(app).post("/save").send({ username, game });
    const response = await request(app).get(`/public/users/${username}`).send();

    console.log(JSON.stringify(response.body));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.username).toBe(username);
    expect(response.body.stats).toEqual(expectedStats); // FIXME: WHy is this not working wtf
  });

  it("Should get empty user stats", async () => {
    const response = await request(app).get(`/public/users/${username}`).send();

    console.log(JSON.stringify(response.body));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.username).toBe(username);
    expect(response.body.stats).toEqual({
      time: {
        total: 0,
        game: {
          min: 0,
          max: 0,
          avg: 0,
        },
        question: {
          min: 0,
          max: 0,
          avg: 0,
        },
      },
      question: {
        passed: 0,
        failed: 0,
        total: 0,
      },
      game: {
        total: 0,
      },
    });
  });

  it("Should reject invalid users", async () => {
    const responses = await Promise.all([
      request(app).get("/public/users/nonexistent").send(),
      request(app).get("/users/nonexistent/games").send(),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not Found");
    }
  });
});

it("Should reject invalid routes", async () => {
  const response = await request(app).get("/nonexistent").send();

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe("Not Found");
});
