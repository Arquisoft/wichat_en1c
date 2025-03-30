// @ts-check

const { checkExact, param } = require("express-validator");
const validation = require("../../validation");
const { User } = require("../../model");
const { STATUS_CODES } = require("http");
const { create } = require("domain");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  app.get(
    "/games/:username",
    ...validation.setup(validation.fields.username(param), checkExact()),
    async (req, res) => {
      const user = await User.findOne(
        {
          username: req.params.username.toString(),
        },
        { games: 1, username: 1 }
      );

      if (user == null) {
        res.status(404).json({
          success: false,
          message: STATUS_CODES[404],
        });
        return;
      }
      // TODO: ADD sorting and pagination

      // Remove unnecessary fields from the user object
      const games = user?.toJSON({
        transform: (_doc, ret) => {
          delete ret._id;
          delete ret.__v;
          return ret;
        },
      }).games;

      res.json({
        success: true,
        username: user.username,
        games,
      });
    }
  );
};
