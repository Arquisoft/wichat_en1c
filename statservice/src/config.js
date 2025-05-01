// @ts-check
const pkg = require("../package.json");

module.exports = {
  name: `${pkg.name}@${pkg.version}`,
  port: Number(process.env.PORT ?? 8003),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/wichat",
  game: {
    config: {
      modes: ["musician", "scientist", "actor", "painter", "writer"],
      rounds: { min: 1 },
      time: { min: 10 },
      hints: { min: 0 },
    },
    questions: {
      min: 1,
      minAnswers: 2,
    },
  },
  pagination: {
    maxSize: 500,
    defaultSize: 10,
  },
};
