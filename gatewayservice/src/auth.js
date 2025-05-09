// @ts-check

const { default: axios } = require("axios");
const config = require("./config");
const express = require("express");
const { STATUS_CODES } = require("http");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) =>
  app.use(config.auth.paths, express.json(), async (req, res, next) => {
    const [type, token] = req.headers.authorization?.split(/\s+/) ?? [];

    // Perform verification
    try {
      // Verify token exists and is 'Bearer'
      if (type?.toLowerCase() !== "bearer" || token == null || token === "")
        throw Error("Invalid token");

      const verification = await axios.post(config.auth.url, {
        token,
      });

      // Attach logged-in username
      req.headers["content-type"] = "application/json";
      req.body ??= {};
      req.body.username = verification.data.username;

      next();
    } catch (err) {
      if (
        err.message === "Invalid token" ||
        err.status?.toString().startsWith("4")
      )
        res
          .header("WWW-Authenticate", "Bearer")
          .status(401)
          .json({ success: false, message: STATUS_CODES[401] });
      else next(err);
    }
  });
