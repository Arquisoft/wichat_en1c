// @ts-check

const { checkExact, body } = require("express-validator");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const validation = require("../../validation");
const { User } = require("../../model");
const config = require("../../config");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  app.post(
    "/login",
    ...validation.setup(
      400,
      body("username").isString(),
      body("password").isString(),
      checkExact()
    ),
    // Second validation to avoid useless database queries
    ...validation.setup(
      401,
      validation.fields.username,
      validation.fields.password
    ),
    async (req, res) => {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (
        user != null &&
        (await argon2.verify(user.password, password, config.crypt))
      )
        res.send(jwt.sign({ username }, config.jwt.secret, config.jwt.opts));
      else res.sendStatus(401);
    }
  );
};
