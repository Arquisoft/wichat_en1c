// @ts-check

const request = require("supertest");
const express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");
const {
  setupDefaultHandlers,
  connectDB,
  startServer,
  setupLogger,
} = require("@wichat_en1c/common");
const {
  beforeAll,
  afterAll,
  describe,
  it,
  expect,
  afterEach,
} = require("@jest/globals");
const { default: mongoose } = require("mongoose");

/** @type {import("mongodb-memory-server").MongoMemoryServer} */
let mongoServer;

/** @type {import("http").Server} */
let server;

beforeAll(async () => {
  // Create testing MongoDB server
  mongoServer = await MongoMemoryServer.create();
});

afterAll(async () => {
  await mongoServer.stop();
});

afterEach(async () => {
  jest.clearAllMocks();
  await new Promise((r) => {
    if (server != null) server.close(r);
    else r();
  });
});

describe("Helper functions (index.js)", () => {
  it("Should start up the server & shutdown gracefully", async () => {
    // Mocks
    const closed = jest.fn();

    // Setup
    const app = express();

    app.get("/", (req, res) => {
      res.json({ success: true });
    });

    server = startServer(app, 9998);
    server.on("close", closed);

    // Test
    const response = await request(server).get("/").send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);

    await new Promise((r) => {
      server.on("close", r);
      process.emit("SIGTERM");
    });

    expect(closed).toHaveBeenCalled();
  });

  it("Should start up the DB & shutdown gracefully", async () => {
    // Mocks
    const opened = jest.fn();
    mongoose.connection.on("connected", opened);
    const closed = jest.fn();
    mongoose.connection.on("close", closed);

    // Setup
    const app = express();

    app.get("/", (req, res) => {
      res.json({ success: true });
    });

    const connected = connectDB(mongoServer.getUri());
    server = startServer(app, 9998);

    // Test
    const response = await request(server).get("/").send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);

    await connected;
    expect(mongoose.connection.readyState).toBe(1); // Connected

    await new Promise((r) => {
      mongoose.connection.on("close", r);
      process.emit("SIGTERM");
    });

    expect(opened).toHaveBeenCalled();
    expect(closed).toHaveBeenCalled();
    expect(mongoose.connection.readyState).toBe(0);
  });

  it("Should handle 404s & errors", async () => {
    // Setup
    const app = express();

    app.get("/error", () => {
      throw new Error("Test error");
    });
    setupDefaultHandlers(app);

    server = app.listen(9998);

    // Test
    const response = await request(server).get("/404").send();

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "Not Found");

    const errorResponse = await request(server).get("/error").send();

    expect(errorResponse.status).toBe(500);
    expect(errorResponse.body).toHaveProperty("success", false);
    expect(errorResponse.body).toHaveProperty(
      "message",
      "Internal Server Error"
    );
  });

  it("Should setup logger", async () => {
    // Setup
    const app = express();
    setupLogger(app, "test");

    app.get("/verify", (req, res) => {
      res.json({ success: req.log != null && res.log != null });
    });

    server = app.listen(9998);

    // Test
    const response = await request(server).get("/verify").send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
  });

  it("All fns should be able to work together", async () => {
    // Mocks
    const closed = jest.fn();

    const dbOpened = jest.fn();
    const dbClosed = jest.fn();
    mongoose.connection.on("connected", dbOpened);
    mongoose.connection.on("close", dbClosed);

    // Setup
    const app = express();
    setupLogger(app, "test");

    app.get("/verify", (req, res) => {
      res.json({ success: req.log != null && res.log != null });
    });

    app.get("/error", () => {
      throw new Error("Test error");
    });

    setupDefaultHandlers(app);
    connectDB(mongoServer.getUri());
    server = startServer(app, 9998);
    server.on("close", closed);

    // Test
    const response404 = await request(server).get("/404").send();

    expect(response404.status).toBe(404);
    expect(response404.body).toHaveProperty("success", false);
    expect(response404.body).toHaveProperty("message", "Not Found");

    const errorResponse = await request(server).get("/error").send();

    expect(errorResponse.status).toBe(500);
    expect(errorResponse.body).toHaveProperty("success", false);
    expect(errorResponse.body).toHaveProperty(
      "message",
      "Internal Server Error"
    );

    const response = await request(server).get("/verify").send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);

    const promises = Promise.all([
      new Promise((r) => server.on("close", r)),
      new Promise((r) => mongoose.connection.on("close", r)),
    ]);
    process.emit("SIGTERM");
    await promises;

    expect(dbOpened).toHaveBeenCalled();
    expect(dbClosed).toHaveBeenCalled();
    expect(closed).toHaveBeenCalled();
    expect(mongoose.connection.readyState).toBe(0);
  });

  it("Should handle DB connection errors", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("exit");
    });

    const mockConnect = jest
      .spyOn(mongoose, "connect")
      .mockImplementation(() => {
        throw new Error("Connection error");
      });

    try {
      await connectDB("mongodb://invalid-uri?serverSelectionTimeoutMS=100");
      expect(true).toBe(false); // Should not reach this line
    } catch (err) {
      expect(err.message).toBe("exit");
    }

    expect(mockConnect).toHaveBeenCalledWith(
      "mongodb://invalid-uri?serverSelectionTimeoutMS=100"
    );
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
    mockConnect.mockRestore();
  });
});

describe("DB model (model.js)", () => {
  it("Should be able to be used", async () => {
    // Setup
    const { User, Game, Question } = require("@wichat_en1c/common/model");
    await mongoose.connect(mongoServer.getUri());

    // Test
    const users = await User.find();
    const games = await Game.find();
    const questions = await Question.find();

    expect(users).toBeDefined();
    expect(games).toBeDefined();
    expect(questions).toBeDefined();
    expect(users).toBeInstanceOf(Array);
    expect(games).toBeInstanceOf(Array);
    expect(questions).toBeInstanceOf(Array);
    expect(users.length).toBe(0);
    expect(games.length).toBe(0);
    expect(questions.length).toBe(0);

    await mongoose.connection.close();
  });
});
