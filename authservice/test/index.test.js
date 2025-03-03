// TODO: Implement test cases for the auth service
// 1. Test the login operation
// 2. Test the register operation
// 3. Test the verify operation

const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const argon2 = require("argon2");
const { User } = require("../src/model");

let mongoServer;
let app;

//test user
const user = {
  username: "testuser",
  password: "testpassword",
};

async function addUser(user) {
  const hashedPassword = await argon2.hash(user.password);
  const newUser = new User({
    username: user.username,
    password: hashedPassword,
  });

  await newUser.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require("../src");
  //Load database with initial conditions
  await addUser(user);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe("Auth Service", () => {
  it("Should perform a login operation /login", async () => {
    const response = await request(app).post("/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "testuser");
  });
});
