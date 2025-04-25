// @ts-check
const { checkExact, body } = require("express-validator");
const { STATUS_CODES } = require("http");
const validation = require("../validation");
const { User, Game, Question } = require("@wichat_en1c/common/model");
const { sanitizeFilter } = require("mongoose");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  app.post(
    "/save",
    ...validation.setup(
      validation.fields.username(body),
      ...validation.fields.game,
      checkExact()
    ),
    async (req, res) => {
      const { username, game: rawGame } = req.body;
      const game = sanitizeFilter(rawGame); // Sanitize user input

      //* Check user and append id
      const user = await User.findOne({ username: username.toString() });
      if (user == null) {
        res.status(404).json({
          success: false,
          message: STATUS_CODES[404],
        });
        return;
      }
      game.user = user._id;

      //* Save questions
      game.questions = await Promise.all(
        game.questions.map(async (question) => {
          const {
            time,
            answers: { selected },
          } = question;

          delete question.answers.selected;
          delete question.time;

          return {
            question: await Question.create(question).then((q) => q._id),
            time,
            selected,
          };
        })
      );

      //* Save game
      await Game.create(game); // SAFE: Sanitized

      res.status(201).json({
        success: true,
        message: STATUS_CODES[201],
      });
    }
  );
};
