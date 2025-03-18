// @ts-check

const { body, validationResult } = require("express-validator");
const { STATUS_CODES } = require("http");
const config = require("./config");

/**
 * @type {(status: number, ...vals: import("express").RequestHandler[]) => import("express").RequestHandler[]}
 */
const setup = (status, ...vals) => {
  vals.push((req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      res.status(status).json({
        success: false,
        message: STATUS_CODES[status],
        errors: status === 400 ? errors.mapped() : undefined,
      });
    else next();
  });
  return vals;
};

module.exports = {
  fields: {
    username: body("username")
      .isString()
      .isAlphanumeric()
      .isLength({ min: 5, max: 20 }),
    password: body("password").isString().isStrongPassword(config.pass),
    token: body("token").isJWT(),
  },
  setup,
};
