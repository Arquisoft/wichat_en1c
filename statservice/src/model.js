// @ts-check

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  time: {
    type: {
      started: { type: Date, required: true },
      finished: { type: Date, required: true },
    },
    required: true,
  },
  question: { type: String, required: true },
  answers: {
    type: {
      opts: { type: [String], required: true },
      correct: { type: Number, required: true },
      selected: { type: Number, required: true },
    },
    required: true,
  },
});

const gameSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  time: {
    type: {
      started: { type: Date, required: true },
      finished: { type: Date, required: true },
    },
    required: true,
  },
  config: {
    type: {
      mode: { type: String, required: true },
      rounds: { type: Number, required: true },
      time: { type: Number, required: true },
      hints: { type: Number, required: true },
    },
    required: true,
  },
  questions: { type: [questionSchema], required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  games: [gameSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
