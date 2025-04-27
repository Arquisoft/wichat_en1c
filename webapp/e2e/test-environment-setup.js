const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoserver;
let gameservice;
let authservice;
let llmservice;
let gatewayservice;
let questionservice;
let statservice;

async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    process.env.LLM_API_KEY = "AIzaSyDFJxxVZW7D4bAON5lb1ZjztwnsDXgZc0U";
    process.env.JWT_SECRET="taQsGacC5vKIsyeqG7CWMAAXj5wDupW44xZAac15BKqClDz9Tdpxmfi4cLHRAteJ";
    process.env.CRYPT_SECRET="CkKX2UFsHqVrP3PpU8YTJAe3SV6u2cwwHqX83LYmwoV7LRJ1VW6JhbUVKufRbUaT";
    authservice = await require("../../authservice/src/index");
    llmservice = await require("../../llmservice/llm-service");
    gatewayservice = await require("../../gatewayservice/src/index");
    gameservice = await require("../../gameservice/src/index");
    questionservice = await require("../../questionservice/question-service");
    statservice = await require("../../statservice/src/index");
}

startServer();
