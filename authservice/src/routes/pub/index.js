// @ts-check

const login = require("./login");
const express = require("express");
const signup = require("./signup");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  const router = express.Router();
  login(router);
  signup(router);
  app.use("/public", router);
};
