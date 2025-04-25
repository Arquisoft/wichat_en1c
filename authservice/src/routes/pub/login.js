// @ts-check

const { checkExact, body } = require("express-validator");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { STATUS_CODES } = require("http");
const { User } = require("@wichat_en1c/common/model");

const validation = require("../../validation");
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
      const username = req.body.username.toString();
      const password = req.body.password.toString();

      const user = await User.findOne({ username });

      if (
        user != null &&
        (await argon2.verify(user.password, password, config.crypt))
      )
        res.json({
          success: true,
          token: jwt.sign({ username }, config.jwt.secret, config.jwt.opts),
          username,
        });
      else res.status(401).json({ success: false, message: STATUS_CODES[401] });
    }
  );
};
