const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')

const app = express();
const port = 8000;

//URLS OF THE SERVICES
const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:8001';
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002'; 
const statsServiceUrl = process.env.STATS_SERVICE_URL || 'http://localhost:8003';
const questionsServiceUrl = process.env.QUESTIONS_SERVICE_URL || 'http://localhost:8004';


app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });  
});

// Token verification middleware
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const response = await axios.post(`${authServiceUrl}/verify`, { token });
    if (response.data.success) {
      next();
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};


// Proxy Middleware Setup
const { createProxyMiddleware } = require('http-proxy-middleware');

const createServiceProxy = (target, protectedRoute = false) => {
  const middleWare = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) => path.replace(/^\/(public|questions|game|stats)/, ''),
    onError: (err, req, res) => {
      console.error(`Proxy error: ${err.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
});
  return protectedRoute ? [verifyToken, middleWare] : middleWare;
};

// Attach Proxy Routes
app.use('/public', createServiceProxy(authServiceUrl));
app.use('/questions', createServiceProxy(questionsServiceUrl), true);  
app.use('/game', createServiceProxy(gameServiceUrl), true);
app.use('/stats', createServiceProxy(statsServiceUrl), true);


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