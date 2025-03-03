// @ts-check

const { checkExact } = require("express-validator");
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
      401, // The password/username is incorrect for sure
      validation.fields.username,
      validation.fields.password,
      checkExact()
    ),
    async (req, res) => {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (user == null || !(await argon2.verify(user.password, password)))
        res.sendStatus(401);
      else res.send(jwt.sign({ username }, config.jwt.secret, config.jwt.opts));
    }
  );
};
