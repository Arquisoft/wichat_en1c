const request = require("supertest");
const fs = require("fs");

jest.mock("fs");
fs.existsSync.mockReturnValue(false);

// Modify the config to point to the mock server
const config = require("../src/config");

const mockURL = "http://localhost:9999";
config.proxyOpts.router["/game"] = `${mockURL}/game`;
config.proxyOpts.router["/auth"] = `${mockURL}/auth`;
config.proxyOpts.router["/stats"] = `${mockURL}/stats`;
config.proxyOpts.router["/questions"] = `${mockURL}/questions`;
config.auth.url = `${mockURL}/auth/verify`;
config.proxyOpts.proxyTimeout = 500;

// Setup
let server, mockServer;
beforeAll(() => {
  mockServer = require("./mockServer");
  server = require("../src");
});

afterAll(() => {
  mockServer.close();
  server.close();
});

// Tests
describe("Gateway Service", () => {
  describe("Proxy", () => {
    test("Should proxy to the appropriate service & path", async () => {
      const agent = request(server);
      const responses = await Promise.all([
        agent.get("/auth/path?ok").send({ ok: true }),
        agent.get("/questions/path?ok").send({ ok: true }),
        agent
          .get("/game/path?ok")
          .set({ Authorization: "Bearer test" })
          .send({ ok: true }),
        agent
          .get("/stats/path?ok")
          .set({ Authorization: "Bearer test" })
          .send({ ok: true }),
      ]);

      for (const response of responses) {
        expect(response.statusCode).toBe(200);
        expect(response.body.params.path).toBe("path"); // path is passed
        expect(response.body.query.ok).toBe(""); // query is passed
        expect(response.body.body.ok).toBe(true); // body is passed
      }

      // The correct service is called
      expect(responses[0].body.params.game).toBe("auth");
      expect(responses[1].body.params.game).toBe("questions");
      expect(responses[2].body.params.game).toBe("game");
      expect(responses[3].body.params.game).toBe("stats");
    });

    test("Should not rely non service paths", async () => {
      const response = await request(server).get("/invalid/path");
      expect(response.statusCode).toBe(404);
    });

    test("Should rely the status code from the proxied service", async () => {
      const status = [200, 201, 400, 401, 500];
      const responses = await Promise.all(
        status.map((s) => request(server).get(`/questions/status/${s}`))
      );

      for (let i = 0; i < status.length; i++) {
        expect(responses[i].statusCode).toBe(status[i]);
        expect(responses[i].body.status).toBe(status[i].toString());
      }
    });

    test("Should authenticate routes that require it", async () => {
      const responses = await Promise.all([
        request(server).get("/game"),
        request(server).get("/game/protected"),
      ]);

      for (const response of responses) {
        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Unauthorized");
        expect(response.headers["www-authenticate"]).toBe("Bearer");
      }
    });

    test("Should handle authentication service going down", async () => {
      config.auth.url = "http://localhost:1111";

      const response = await request(server)
        .get("/game/protected")
        .set({ Authorization: "Bearer test" });

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Internal Server Error");

      config.auth.url = "http://localhost:9999/verify";
    });

    test("Should handle timeouts and proxing errors", async () => {
      const responses = await Promise.all([
        request(server).get("/questions/fail"),
        request(server).get("/questions/timeout"),
      ]);

      for (const response of responses) {
        expect(response.statusCode).toBe(504);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Gateway Timeout");
      }
    });
  });

  test("Should return healthy status", async () => {
    const response = await request(server).get("/health");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("OK");
  });

  test("Should raise 404 if no OpenAPI file reachable", async () => {
    const response = await request(server).get("/api-doc");
    expect(response.statusCode).toBe(404);
  });
});
