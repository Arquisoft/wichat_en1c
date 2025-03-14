const express = require('express');
const http = require('http');
const request = require('supertest');

process.env.GAME_SERVICE_URL = 'http://localhost:8001';
process.env.AUTH_SERVICE_URL = 'http://localhost:8002';
process.env.STATS_SERVICE_URL = 'http://localhost:8003';
process.env.QUESTIONS_SERVICE_URL = 'http://localhost:8004';

const gateway = require('./gateway-service'); // Importamos la Gateway

let mockStatsServer;

// Función para crear un servidor mock en un puerto específico
const createMockServer = (port, routes) => {
  const app = express();
  app.use(express.json());
  routes(app);
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(port, () => resolve(server));
  });
};

// Antes de los tests, iniciamos solo el servidor mock de Stats
beforeAll(async () => {
  mockStatsServer = await createMockServer(8003, (app) => {
    app.get('/leaderboard', (req, res) => res.json({ topPlayers: ['user1', 'user2'] }));
  });
});

// Después de los tests, cerramos el servidor mock y el Gateway
afterAll(async () => {
  await mockStatsServer.close();
  gateway.close();
});

// 📌 Test: Verificar que el Gateway responde correctamente al health check
test('should return health status', async () => {
  const response = await request(gateway).get('/health');
  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe('OK');
}, 5000);

// 📌 Test: Verificar que el Gateway reenvía la solicitud para obtener el leaderboard
test('should forward leaderboard request to stats service', async () => {
  const response = await request(gateway).get('/stats/leaderboard');

  expect(response.statusCode).toBe(200);
  expect(response.body.topPlayers).toEqual(['user1', 'user2']);
}, 5000);

// 📌 Test: Verificar que el Gateway devuelve error si el servicio de autenticación no está disponible
test('should return 504 if auth service is unavailable', async () => {
  const response = await request(gateway)
    .post('/auth/login')
    .send({ username: 'user', password: 'pass' });

  expect(response.statusCode).toBe(504);
}, 5000);

// 📌 Test: Verificar que el Gateway devuelve error si el servicio de preguntas no está disponible
test('should return 504 if questions service is unavailable', async () => {
  const response = await request(gateway)
    .post('/questions/ask')
    .send({ question: 'question', apiKey: 'apiKey', model: 'gemini' });

  expect(response.statusCode).toBe(504);
}, 5000);

// 📌 Test: Verificar que el Gateway devuelve error si el servicio de juego no está disponible
test('should return 504 if game service is unavailable', async () => {
  const response = await request(gateway)
    .post('/game/start')
    .send({ userId: 'testuser' });

  expect(response.statusCode).toBe(504);
}, 5000);
