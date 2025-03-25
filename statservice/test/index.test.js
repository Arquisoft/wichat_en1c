// @ts-check

const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const config = require("../src/config");
const { User } = require("../src/model");
const {
  beforeAll,
  afterAll,
  describe,
  it,
  expect,
  afterEach,
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

const date = new Date("2021-01-01");

// Test data
const username = "testuser";
const game = {
  time: {
    started: date,
    finished: date,
  },
  config: {
    mode: "musicians",
    rounds: 3,
    time: 100,
    hints: 3,
  },
  questions: [
    {
      time: {
        started: date,
        finished: date,
      },
      question: "Hola?",
      answers: {
        opts: ["1", "2"],
        selected: 0,
        correct: 1,
      },
    },
  ],
};

beforeAll(async () => {
  // Create testing MongoDB server
  mongoServer = await MongoMemoryServer.create();
  config.mongoUri = mongoServer.getUri();

  // Run app
  app = require("../src");
});

beforeEach(async () => {
  // Clear database
  await User.deleteMany({});
  // Create test user
  await User.insertOne({ username });
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
    const dbGame = (await User.findOne({ username }))?.games?.[0];
    expect(dbGame?.toJSON()).toMatchObject(game);
  });

  it("Should reject non-existent usernames", async () => {
    const response = await request(app)
      .post("/save")
      .send({ username: "nonexistent", game });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Not Found");

    // Check not insertion
    const dbGame = (await User.findOne({ username }))?.games?.[0];
    expect(dbGame).toBeUndefined();
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
    const dbGame = (await User.findOne({ username }))?.games?.[0];
    expect(dbGame).toBeUndefined();
  });
});
