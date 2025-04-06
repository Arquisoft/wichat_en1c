// @ts-check

const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const data = require("./data");
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

const username = "testuser";

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
    const response = await request(app)
      .post("/save")
      .send({ username, game: data.game });

    // Check response
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Created");

    // Check insertion
    const dbGame = await Game.findOne({ user: userId }).populate(
      "questions.question"
    );
    expect(dbGame?.toJSON()).toMatchObject(data.dbGame);
  });

  it("Should reject non-existent usernames", async () => {
    const response = await request(app)
      .post("/save")
      .send({ username: "nonexistent", game: data.game });

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
        .send({ username, game: { ...data.game, time: {} } }),
      request(app)
        .post("/save")
        .send({ username, game: { ...data.game, config: {} } }),
      request(app)
        .post("/save")
        .send({ username, game: { ...data.game, questions: [] } }),
      request(app)
        .post("/save")
        .send({ username, game: { ...data.game, questions: [{}] } }),
      request(app)
        .post("/save")
        .send({
          username,
          game: { ...data.game, questions: [{ answers: {} }] },
        }),
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

describe("User routes", () => {
  describe("Stats", () => {
    it("Should get user stats", async () => {
      await request(app).post("/save").send({ username, game: data.game });
      const response = await request(app)
        .get(`/public/users/${username}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.username).toBe(username);
      expect(response.body.stats).toEqual(data.stats);
    });

    it("Should get empty user stats", async () => {
      const response = await request(app)
        .get(`/public/users/${username}`)
        .send();

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
          hints: {
            total: 0,
            min: 0,
            max: 0,
            avg: 0,
          },
        },
      });
    });

    it("Should reject non-existent usernames", async () => {
      const response = await request(app)
        .get("/public/users/nonexistent")
        .send();

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not Found");
    });
  });

  describe("Games", () => {
    it("Should get user games", async () => {
      await Promise.all([
        request(app).post("/save").send({ username, game: data.game }),
        request(app).post("/save").send({ username, game: data.game }),
      ]);

      const response = await request(app)
        .get(`/public/users/${username}/games`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.username).toBe(username);
      expect(response.body.games).toBeDefined();
      expect(response.body.games.length).toBe(2);
      expect(response.body.games).toMatchObject([data.jsonGame, data.jsonGame]);
    });
    it("Should get empty user games", async () => {
      const response = await request(app)
        .get(`/public/users/${username}/games`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.username).toBe(username);
      expect(response.body.games).toBeDefined();
      expect(response.body.games.length).toBe(0);
    });
    it("Should reject non-existent usernames", async () => {
      const response = await request(app)
        .get("/public/users/nonexistent/games")
        .send();

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not Found");
    });
    it("Should paginate correctly", async () => {
      const modGame = {
        ...data.game,
        config: { ...data.game.config, hints: 1 },
      };

      const expectedModGame = {
        ...data.jsonGame,
        config: { ...data.jsonGame.config, hints: 1 },
      };

      //                                                                        (Sorted by creation date desc)
      await request(app).post("/save").send({ username, game: modGame }); //    Second game
      await request(app).post("/save").send({ username, game: data.game }); //  First game

      const responses = await Promise.all([
        request(app)
          .get(`/public/users/${username}/games`)
          .query({
            page: 0,
            size: 1,
          })
          .send(),
        request(app)
          .get(`/public/users/${username}/games`)
          .query({
            page: 1,
            size: 1,
          })
          .send(),
        request(app)
          .get(`/public/users/${username}/games`)
          .query({
            size: 3,
          })
          .send(),
      ]);

      for (const response of responses) {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.username).toBe(username);
        expect(response.body.games).toBeDefined();
      }

      expect(responses[0].body.games.length).toBe(1);
      expect(responses[1].body.games.length).toBe(1);
      expect(responses[2].body.games.length).toBe(2);

      expect(responses[0].body.games[0]).toMatchObject(data.jsonGame);
      expect(responses[1].body.games[0]).toMatchObject(expectedModGame);
      expect(responses[2].body.games).toMatchObject([
        data.jsonGame,
        expectedModGame,
      ]);
    });
    it("Should reject invalid pagination", async () => {
      const responses = await Promise.all([
        request(app)
          .get(`/public/users/${username}/games`)
          .query({
            page: -1,
          })
          .send(),
        request(app)
          .get(`/public/users/${username}/games`)
          .query({
            size: -1,
          })
          .send(),
        request(app)
          .get(`/public/users/${username}/games`)
          .query({
            size: config.pagination.maxSize + 1,
          })
          .send(),
        request(app)
          .get(`/public/users/${username}/games`)
          .query({
            page: -1,
            size: -1,
          })
          .send(),
      ]);

      for (const response of responses) {
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Bad Request");
        expect(response.body.errors).toBeDefined();
      }
    });
  });
});

describe("Games routes", () => {
  it("Should reject invalid game IDs", async () => {
    const response = await request(app).get("/public/games/invalidid").send();

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Bad Request");
    expect(response.body.errors).toBeDefined();
  });

  it("Should reject non-existant game IDs", async () => {
    const response = await request(app)
      .get("/public/games/111111111111111111111111")
      .send();

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Not Found");
  });

  it("Should get game by ID", async () => {
    await request(app).post("/save").send({ username, game: data.game });
    const gamesRes = await request(app)
      .get(`/public/users/${username}/games`)
      .query({
        size: 1,
      })
      .send();

    expect(gamesRes.body.games[0].id).toBeDefined();

    const response = await request(app)
      .get(`/public/games/${gamesRes.body.games[0].id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.game).toMatchObject(data.jsonGame);
  });
});

it("Should reject invalid routes", async () => {
  const response = await request(app).get("/nonexistent").send();

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe("Not Found");
});
