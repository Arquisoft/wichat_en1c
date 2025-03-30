// @ts-check

const { checkExact, param } = require("express-validator");
const validation = require("../../validation");
const { User } = require("../../model");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  app.get(
    "/users/:username",
    ...validation.setup(validation.fields.username(param), checkExact()),
    async (req, res) => {
      const username = req.params.username.toString();

      // TODO:
      res.send();
    }
  );
};
