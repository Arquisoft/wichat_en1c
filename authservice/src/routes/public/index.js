// @ts-check

const login = require("./login");
const express = require("express");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  const router = express.Router();
  login(router);
  app.use("/public", router);
};
