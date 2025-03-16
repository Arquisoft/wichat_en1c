const express = require('express');
const http = require('http');
const request = require('supertest');
const server = require('./gateway-service'); 

process.env.GAME_SERVICE_URL = 'http://localhost:8001';
process.env.AUTH_SERVICE_URL = 'http://localhost:8002';
process.env.STATS_SERVICE_URL = 'http://localhost:8003';
process.env.QUESTIONS_SERVICE_URL = 'http://localhost:8004';
process.env.TEST_USERNAME="user";
process.env.TEST_PASSWORD="pass";


// Mock services for the unitary tests
jest.mock('fs');
const fs = require('fs');
fs.existsSync.mockReturnValue(true);
fs.readFileSync.mockReturnValue(`
  openapi: "3.0.0"
  info:
    title: Test API
    version: "1.0.0"
`);

const gateway = require('./gateway-service'); // Import after mock services

let mockStatsServer, mockAuthServer, mockQuestionsServer, mockGameServer;

const createMockServer = (port, routes) => {
  const app = express();
  app.use(express.json());
  routes(app);
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(port, () => resolve(server));
  });
};

beforeAll(async () => {
  mockStatsServer = await createMockServer(8003, (app) => {
    app.get('/leaderboard', (req, res) => res.json({ topPlayers: ['user1', 'user2'] }));
  });

  mockAuthServer = await createMockServer(8002, (app) => {
    app.post('/login', (req, res) => res.status(200).json({ token: 'mockToken' }));
  });

  mockQuestionsServer = await createMockServer(8004, (app) => {
    app.post('/ask', (req, res) => res.json({ answer: 'mocked answer' }));
  });

  mockGameServer = await createMockServer(8001, (app) => {
    app.get('/failing-endpoint', (req, res) => {
      res.status(500).json({ error: 'Forced error' });
    });
  });
});

afterAll(async () => {
  await mockStatsServer.close();
  await mockAuthServer.close();
  await mockQuestionsServer.close();
  await mockGameServer.close();
  gateway.close();
  server.close();
});

test('should return health status', async () => {
  const response = await request(gateway).get('/health');
  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe('OK');
}, 5000);

test('should forward leaderboard request to stats service', async () => {
  const response = await request(gateway).get('/stats/leaderboard');
  expect(response.statusCode).toBe(200);
  expect(response.body.topPlayers).toEqual(['user1', 'user2']);
}, 5000);

test('should return 504 if auth service is unavailable', async () => {
  await mockAuthServer.close();
  const response = await request(gateway)
    .post('/auth/login')
    .send({ 
      username: process.env.TEST_USERNAME || 'user', 
      password: process.env.TEST_PASSWORD || 'pass' 
    });

  expect(response.statusCode).toBe(504);
}, 5000);


test('should return 504 if questions service is unavailable', async () => {
  await mockQuestionsServer.close();
  const response = await request(gateway)
    .post('/questions/ask')
    .send({ question: 'question', apiKey: 'apiKey', model: 'gemini' });
  expect(response.statusCode).toBe(504);
}, 5000);

test('should return 504 if game service is unavailable', async () => {
  await mockGameServer.close();
  const response = await request(gateway)
    .post('/game/start')
    .send({ userId: 'testuser' });
  expect(response.statusCode).toBe(504);
}, 5000);

test('should handle proxy error and return 504 for unavailable service', async () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  const response = await request(gateway).get('/game/failing-endpoint');

  expect(response.statusCode).toBe(504);

  consoleSpy.mockRestore();
}, 5000);


test('should raise 404 if no OpenAPI file reachable', async () => {
  fs.existsSync.mockReturnValue(true); 
  fs.readFileSync.mockReturnValue(`
    openapi: "3.0.0"
    info:
      title: Test API
      version: "1.0.0"
  `);

  const response = await request(gateway).get('/api-doc');

  expect(response.statusCode).toBe(404);
}, 5000);


