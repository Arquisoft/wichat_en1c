const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
const swaggerUi = require('swagger-ui-express');
const fs = require("fs");
const YAML = require('yaml');

const app = express();
const port = 8000;

const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:8001';
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://authservice:8002';
const statsServiceUrl = process.env.STATS_SERVICE_URL || 'http://localhost:8003';
const questionsServiceUrl = process.env.QUESTIONS_SERVICE_URL || 'http://localhost:8004';

app.use(cors());
app.use(express.json());

const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Custom Proxy Middleware
const customProxyMiddleware = (target) => {
  return async (req, res) => {
    try {
      const targetUrl = target + req.url.replace(/^\/(auth|questions|game|stats)/, '');
      console.log(`Custom Proxy: Forwarding to ${targetUrl}`);

      const axiosRes = await axios({
        method: req.method,
        url: targetUrl,
        headers: req.headers,
        data: req.body,
        validateStatus: () => true, // Don't throw on non-2xx status
      });

      Object.keys(axiosRes.headers).forEach((headerName) => {
        res.setHeader(headerName, axiosRes.headers[headerName]);
      });

      res.status(axiosRes.status).send(axiosRes.data);
    } catch (error) {
      console.error(`Custom Proxy Error: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

// Attach Proxy Routes (using custom proxy)
app.use('/auth', customProxyMiddleware(authServiceUrl));
app.use('/questions', customProxyMiddleware(questionsServiceUrl));
app.use('/game', customProxyMiddleware(gameServiceUrl));
app.use('/stats', customProxyMiddleware(statsServiceUrl));

// Swagger API Documentation
const openapiPath = './openapi.yaml';
if (fs.existsSync(openapiPath)) {
  try {
    const file = fs.readFileSync(openapiPath, 'utf8');
    const swaggerDocument = YAML.parse(file);
    app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (err) {
    console.error("Error parsing OpenAPI file:", err.message);
  }
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.");
}

// Start Server
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server;