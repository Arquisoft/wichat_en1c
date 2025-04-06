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
    authservice = await require("../../authservice/src/index");
    llmservice = await require("../../llmservice/llm-service");
    gatewayservice = await require("../../gatewayservice/src/index");
    gameservice = await require("../../gameservice/game-service");
    questionservice = await require("../../questionservice/question-service");
    statservice = await require("../../statservice/src/index");
}

startServer();
