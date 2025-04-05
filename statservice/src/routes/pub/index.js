// @ts-check

const express = require("express");
const users = require("./users");
const games = require("./games");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  const router = express.Router();

  users(router);
  games(router);

  app.use("/public", router);
};
