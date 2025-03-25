// @ts-check

module.exports = {
  port: process.env.PORT ?? 8003,
  mongoUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/userdb",
  game: {
    config: {
      modes: ["musicians"],
      rounds: { min: 1 },
      time: { min: 10 },
      hints: { min: 0 },
    },
    questions: {
      min: 1,
      minAnswers: 2,
    },
  },
};
