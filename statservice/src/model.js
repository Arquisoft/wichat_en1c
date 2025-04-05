// @ts-check

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  question: { type: String, required: true },
  image: { type: String, required: true },
  answers: {
    type: {
      opts: { type: [String], required: true },
      correct: { type: Number, required: true },
    },
    required: true,
  },
});

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  time: {
    type: {
      started: { type: Date, required: true },
      finished: { type: Date, required: true },
    },
    required: true,
  },
  hints: { type: Number, required: true },
  config: {
    type: {
      mode: { type: String, required: true },
      rounds: { type: Number, required: true },
      time: { type: Number, required: true },
      hints: { type: Number, required: true },
    },
    required: true,
  },
  questions: {
    type: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        time: {
          type: {
            started: { type: Date, required: true },
            finished: { type: Date, required: true },
          },
          required: true,
        },
        selected: { type: Number, required: true },
      },
    ],
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Game = mongoose.model("Game", gameSchema);
const Question = mongoose.model("Question", questionSchema);

module.exports = { User, Game, Question };
