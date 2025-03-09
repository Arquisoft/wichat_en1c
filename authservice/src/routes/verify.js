// @ts-check

const { checkExact } = require("express-validator");
const jwt = require("jsonwebtoken");

const validation = require("../validation");
const config = require("../config");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  app.post(
    "/verify",
    ...validation.setup(400, validation.fields.token, checkExact()),
    async (req, res) => {
      const { token } = req.body;

      try {
        res.send(
          // @ts-expect-error
          jwt.verify(token, config.jwt.secret, config.jwt.opts).username
        );
      } catch (err) {
        res.sendStatus(401);
      }
    }
  );
};
