// @ts-check
const { checkExact } = require("express-validator");
const { STATUS_CODES } = require("http");
const validation = require("../validation");
const { User } = require("../model");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  app.post(
    "/save",
    ...validation.setup(
      validation.fields.username,
      ...validation.fields.game,
      checkExact()
    ),
    async (req, res) => {
      const { username, game } = req.body;

      const user = await User.findOne({ username });
      if (user == null) {
        res.status(404).json({
          success: false,
          message: STATUS_CODES[404],
        });
        return;
      }

      user.games.push(game);
      await user.save();

      res.status(201).json({
        success: true,
        message: STATUS_CODES[201],
      });
    }
  );
};
