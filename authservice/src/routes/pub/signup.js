// @ts-check

const { checkExact } = require("express-validator");
const argon2 = require("argon2");
const { STATUS_CODES } = require("http");

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
    async (req, res, next) => {
      const username = req.body.username.toString();
      const password = req.body.password.toString();

      const user = await User.findOne({ username }).catch(next);
      if (user != null)
        res.status(401).json({ success: false, message: STATUS_CODES[401] });
      else
        new User({
          username,
          password: await argon2.hash(password, config.crypt),
        })
          .save()
          .then(() => res.status(201).json({ success: true }));
    }
  );
};
