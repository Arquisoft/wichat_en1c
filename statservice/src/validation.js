// @ts-check

const { body, validationResult, query, param } = require("express-validator");
const { STATUS_CODES } = require("http");
const config = require("./config");

/**
 * @param {import("express").RequestHandler[]} vals
 */
const setup = (...vals) => {
  vals.push((req, res, next) => {
    const errors = validationResult(req);

    console.log(req.body);
    console.log(errors.mapped());

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

const messages = {
  missing: "Missing",
  notObject: "Not an object",
  notDate: "Not a date",
  notString: "Not a string",
  notPrevious: "Not before current date",
  notValid: "Not valid",
  notValidNumber: "Not a valid number",
  notValidArray: "Not a valid array",
};

/**
 * @param {string} prefix
 */
const timeValidators = (prefix) => [
  body(`${prefix}.time`, messages.missing)
    .isObject()
    .withMessage(messages.notObject),
  body(`${prefix}.time.started`, messages.missing)
    .isISO8601()
    .withMessage(messages.notDate)
    .isBefore()
    .withMessage(messages.notPrevious)
    .toDate(),
  body(`${prefix}.time.finished`, messages.missing)
    .isISO8601()
    .withMessage(messages.notDate)
    .toDate(),
];

module.exports = {
  fields: {
    /** @type { (fn: (fields?: string | string[], err: string) => import("express-validator").ValidationChain) => import("express-validator").ValidationChain } */
    username: (fn) =>
      fn("username", messages.missing)
        .isString()
        .withMessage(messages.notString)
        .isAlphanumeric()
        .withMessage(messages.notValid)
        .isLength({ min: 5, max: 20 })
        .withMessage(messages.notValid),
    game: [
      body("game", messages.missing).isObject().withMessage(messages.notObject),
      // Number of hints
      body("game.hints", messages.missing)
        .isInt({ min: 0 })
        .withMessage(messages.notValidNumber),
      // Time
      ...timeValidators("game"),

      // Config
      body("game.config", messages.missing)
        .isObject()
        .withMessage(messages.notObject),
      body("game.config.mode", messages.missing)
        .isString()
        .withMessage(messages.notString)
        .toLowerCase()
        .isIn(config.game.config.modes)
        .withMessage(`Not a valid mode ${config.game.config.modes.toString()}`),
      body("game.config.rounds", messages.missing)
        .isInt({ min: config.game.config.rounds.min })
        .withMessage(messages.notValidNumber),
      body("game.config.time", messages.missing)
        .isInt({ min: config.game.config.time.min })
        .withMessage(messages.notValidNumber),
      body("game.config.hints", messages.missing)
        .isInt({ min: config.game.config.hints.min })
        .withMessage(messages.notValidNumber),

      // Questions
      body("game.questions", messages.missing)
        .isArray({
          min: config.game.questions.min,
        })
        .withMessage(messages.notValidArray),
      body("game.questions.*.question", messages.missing)
        .isString()
        .withMessage(messages.notString),
      ...timeValidators("game.questions.*"),

      // Questions answers
      body("game.questions.*.image", messages.missing)
        .isURL()
        .withMessage("Not a valid URL"),
      body("game.questions.*.answers", messages.missing)
        .isObject()
        .withMessage(messages.notObject),
      body("game.questions.*.answers.opts", messages.missing)
        .isArray({
          min: config.game.questions.minAnswers,
        })
        .withMessage(messages.notValidArray),
      body("game.questions.*.answers.correct", messages.missing)
        .isInt({
          min: 0,
        })
        .withMessage(messages.notValidNumber),
      body("game.questions.*.answers.selected", messages.missing)
        .isInt({
          min: 0,
        })
        .withMessage(messages.notValidNumber),
    ],
    pagination: {
      page: query("page")
        .default(0)
        .isInt({ min: 0 })
        .withMessage(messages.notValidNumber)
        .toInt(),
      size: query("size")
        .default(config.pagination.defaultSize)
        .isInt({ min: 1, max: config.pagination.maxSize })
        .withMessage("Not valid or out of range")
        .toInt(),
    },
    id: param("id").isMongoId().withMessage(messages.notValid),
  },
  setup,
};
