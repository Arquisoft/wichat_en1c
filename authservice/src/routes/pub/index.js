// @ts-check

const express = require("express");
const login = require("./login");
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
