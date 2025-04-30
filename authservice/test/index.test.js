const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const argon2 = require("argon2");
const { User } = require("@wichat_en1c/common/model");
const config = require("../src/config");
const jwt = require("jsonwebtoken");

/**
 * @type {import("mongodb-memory-server").MongoMemoryServer}
 */
let mongoServer;
/**
 * @type {import("http").Server}
 */
let app;

// test user
const user = {
  username: "testuser",
  /**
   * Requirements:
   *  minLength: 8|
   *  minLowercase: 1|
   *  minUppercase: 1|
   *  minNumbers: 1|
   *  minSymbols: 1|
   */
  password: "Testuser1!",
};

async function addUser(user) {
  const hashedPassword = await argon2.hash(user.password, config.crypt);
  const newUser = new User({
    username: user.username,
    password: hashedPassword,
  });

  await newUser.save();
}

beforeAll(async () => {
  // Create testing MongoDB server
  mongoServer = await MongoMemoryServer.create();
  config.mongoUri = mongoServer.getUri();

  // Run app
  app = require("../src");

  // Load database with initial conditions
  await addUser(user);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe("Login route", () => {
  it("Should perform a successful login", async () => {
    const response = await request(app).post("/public/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    // Verify token
    expect(response.body).toHaveProperty("token");
    expect(response.body.username).toBe(user.username);
    const verification = jwt.verify(
      response.body.token,
      config.jwt.secret,
      config.jwt.opts
    );
    expect(verification.username).toBe(user.username);
  });

  it("Should reject invalid credentials", async () => {
    const responses = await Promise.all([
      request(app).post("/public/login").send({
        username: user.username,
        password: "invalidpassword",
      }),
      request(app).post("/public/login").send({
        username: "invaliduser",
        password: user.password,
      }),
      request(app).post("/public/login").send({
        username: "invaliduser",
        password: "invalidpassword",
      }),
      request(app).post("/public/login").send({
        username: "",
        password: "",
      }),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Unauthorized");
      expect(response.body.token).toBeUndefined();
      expect(response.body.username).toBeUndefined();
    }
  });

  it("Should reject malformed login requests", async () => {
    const responses = await Promise.all([
      request(app).post("/public/login").send({
        username: user.username,
      }),
      request(app).post("/public/login").send({
        password: user.password,
      }),
      request(app).post("/public/login").send(),
      request(app).post("/public/login").send({
        username: true,
        password: true,
      }),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Bad Request");
      expect(response.body.errors).toBeDefined();
      expect(response.body.token).toBeUndefined();
    }
  });
});

describe("Signup route", () => {
  it("Should perform a successful signup", async () => {
    const newUser = {
      username: "newuser",
      password: "Newuser1!",
    };

    const response = await request(app).post("/public/signup").send(newUser);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    // Verify user was created
    const dbUser = await User.findOne({ username: newUser.username });
    expect(dbUser).toBeDefined();
    expect(
      await argon2.verify(dbUser.password, newUser.password, config.crypt)
    ).toBe(true);
  });

  it("Should reject already registered users", async () => {
    const response = await request(app).post("/public/signup").send({
      username: user.username,
      password: "Newuser1!",
    });
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("Should reject invalid credentials", async () => {
    const responses = await Promise.all([
      request(app).post("/public/signup").send({
        username: "/ilegalUsername",
        password: "Testuser1!",
      }),
      request(app).post("/public/signup").send({
        username: "newuser",
        password: "invalidpassword",
      }),
      request(app).post("/public/signup").send({
        username: "",
        password: "",
      }),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Bad Request");
    }
  });

  it("Should reject malformed requests", async () => {
    const responses = await Promise.all([
      request(app).post("/public/signup").send({
        username: "newuser",
      }),
      request(app).post("/public/signup").send({
        password: "Newuser1!",
      }),
      request(app).post("/public/signup").send(),
      request(app).post("/public/signup").send({
        username: true,
        password: true,
      }),
    ]);

    for (const response of responses) {
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Bad Request");
    }
  });
});

describe("Verify route", () => {
  it("Should verify a valid token", async () => {
    const token = await request(app)
      .post("/public/login")
      .send(user)
      .then((res) => res.body.token);

    const response = await request(app).post("/verify").send({ token });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.username).toBe(user.username);
  });

  it("Should reject invalid tokens", async () => {
    const invalidToken = jwt.sign(
      { username: user.username },
      "invalid-secret"
    );

    const response = await request(app)
      .post("/verify")
      .send({ token: invalidToken });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Unauthorized");
    expect(response.body.username).toBeUndefined();
  });

  it("Should reject malformed requests", async () => {
    const responses = await Promise.all([
      request(app).post("/verify").send({ token: "invalidtoken" }),
      request(app).post("/verify").send({}),
      request(app).post("/verify").send(),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Bad Request");
      expect(response.body.errors).toBeDefined();
      expect(response.body.username).toBeUndefined();
    }
  });
});

it("Should reject invalid routes", async () => {
  const response = await request(app).get("/nonexistent").send();

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe("Not Found");
});
