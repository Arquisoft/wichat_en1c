// @ts-check

const { checkExact } = require("express-validator");
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
      const game = await Game.findById(req.params.id.toString());

      res.json({
        success: true,
        game: game?.toJSON({
          transform: removeMongoDBFields,
        }),
      });
    }
  );
};
