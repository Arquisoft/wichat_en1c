const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 8001;

app.use(cors());

const questionsServiceUrl = process.env.QUESTIONS_SERVICE_URL || 'http://localhost:8003';
const statsServiceUrl = process.env.STATS_SERVICE_URL || 'http://localhost:8004';
