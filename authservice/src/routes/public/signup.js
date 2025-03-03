// @ts-check

const { checkExact } = require("express-validator");
const argon2 = require("argon2");

const validation = require("../../validation");
const { User } = require("../../model");
const config = require("../../config");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  app.post(
    "/signup",
    ...validation.setup(
      400,
      validation.fields.username,
      validation.fields.password,
      checkExact()
    ),
    async (req, res) => {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (user != null) res.status(400);
      else
        new User({
          username,
          password: await argon2.hash(password, config.crypt),
        })
          .save()
          .then(() => res.sendStatus(201));
    }
  );
};
