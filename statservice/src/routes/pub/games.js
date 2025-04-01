// @ts-check

const { checkExact } = require("express-validator");
const { STATUS_CODES } = require("http");
const validation = require("../../validation");
const { Game } = require("../../model");
const { removeMongoDBFields } = require("../../utils");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  app.get(
    "/games/:id",
    ...validation.setup(validation.fields.id, checkExact()),
    async (req, res) => {
      const game = await Game.findById(req.params.id.toString())
        .populate("user", "username")
        .populate("questions.question");

      if (game == null) {
        res.status(404).json({
          success: false,
          message: STATUS_CODES[404],
        });
        return;
      }

      res.json({
        success: true,
        game: game.toJSON({
          transform: removeMongoDBFields,
        }),
      });
    }
  );
};
