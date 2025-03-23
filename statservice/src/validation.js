// @ts-check

const { body, validationResult } = require("express-validator");
const { STATUS_CODES } = require("http");
const config = require("./config");

/**
 * @param {import("express").RequestHandler[]} vals
 */
const setup = (...vals) => {
  vals.push((req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      res.status(400).json({
        success: false,
        message: STATUS_CODES[400],
        errors: errors.mapped(),
      });
    else next();
  });
  return vals;
};

/**
 * @param {string} prefix
 */
const timeValidators = (prefix) => [
  body(`${prefix}.time`).isObject(),
  body(`${prefix}.time.started`).isISO8601().isBefore().toDate(),
  body(`${prefix}.time.finished`).isISO8601().isBefore().toDate(),
];

module.exports = {
  fields: {
    username: body("username")
      .isString()
      .isAlphanumeric()
      .isLength({ min: 5, max: 20 }),
    game: [
      body("game").isObject(),
      // Time
      ...timeValidators("game"),

      // Config
      body("game.config").isObject(),
      body("game.config.mode")
        .isString()
        .toLowerCase()
        .isIn(config.game.config.modes),
      body("game.config.rounds").isInt({ min: config.game.config.rounds.min }),
      body("game.config.time").isInt({ min: config.game.config.time.min }),
      body("game.config.hints").isInt({ min: config.game.config.hints.min }),

      // Questions
      body("game.questions").isArray({ min: config.game.questions.min }),
      body("game.questions.*.question").isString(),
      ...timeValidators("game.questions.*"),

      // Questions answers
      body("game.questions.*.answers").isObject(),
      body("game.questions.*.answers.opts").isArray({
        min: config.game.questions.minAnswers,
      }),
      body("game.questions.*.answers.correct").isInt({
        min: 0,
        max: config.game.questions.minAnswers - 1,
      }),
      body("game.questions.*.answers.selected").isInt({
        min: 0,
        max: config.game.questions.minAnswers - 1,
      }),
    ],
  },
  setup,
};
