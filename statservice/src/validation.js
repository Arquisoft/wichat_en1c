// @ts-check

const { body, validationResult, query } = require("express-validator");
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
  body(`${prefix}.time`, `'${prefix}.time' is missing`)
    .isObject()
    .withMessage(`'${prefix}.time' is not an object`),
  body(`${prefix}.time.started`, `'${prefix}.time.started' is missing`)
    .isISO8601()
    .withMessage(`'${prefix}.time.started' is not a date`)
    .isBefore()
    .withMessage(`'${prefix}.time.started' is not before the current date`)
    .toDate(),
  body(`${prefix}.time.finished`, `'${prefix}.time.finished' is missing`)
    .isISO8601()
    .withMessage(`'${prefix}.time.finished' is not a date`)
    .isBefore()
    .withMessage(`'${prefix}.time.finished' is not before the current date`)
    .toDate(),
];

module.exports = {
  fields: {
    /** @type { (fn: (fields?: string | string[], err: string) => import("express-validator").ValidationChain) => import("express-validator").ValidationChain } */
    username: (fn) =>
      fn("username", "'username' is missing")
        .isString()
        .withMessage("'username' is not a string")
        .isAlphanumeric()
        .withMessage("'username' is not valid")
        .isLength({ min: 5, max: 20 })
        .withMessage("'username' is not valid"),
    game: [
      body("game", "'game' is missing")
        .isObject()
        .withMessage("'game' is not an object"),
      // Time
      ...timeValidators("game"),

      // Config
      body("game.config", "'game.config' is missing")
        .isObject()
        .withMessage("'game.config' is not an object"),
      body("game.config.mode", "'game.config.mode' is missing")
        .isString()
        .withMessage("'game.config.mode' is not a string")
        .toLowerCase()
        .isIn(config.game.config.modes)
        .withMessage(
          `'game.config.mode' is not a valid mode ${config.game.config.modes.toString()}`
        ),
      body("game.config.rounds", "'game.config.rounds' is missing")
        .isInt({ min: config.game.config.rounds.min })
        .withMessage("'game.config.rounds' is not a valid number"),
      body("game.config.time", "'game.config.time' is missing")
        .isInt({ min: config.game.config.time.min })
        .withMessage("'game.config.time' is not a valid number"),
      body("game.config.hints", "'game.config.hints' is missing")
        .isInt({ min: config.game.config.hints.min })
        .withMessage("'game.config.hints' is not a valid number"),

      // Questions
      body("game.questions", "'game.questions' is missing")
        .isArray({
          min: config.game.questions.min,
        })
        .withMessage("'game.questions' is not an array"),
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
