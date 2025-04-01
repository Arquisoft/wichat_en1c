// @ts-check
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("./config");
const { STATUS_CODES } = require("http");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) =>
  app.use(
    createProxyMiddleware({
      pathFilter: (path) =>
        // @ts-expect-error
        Object.keys(config.proxyOpts.router).some((prefix) =>
          path.startsWith(prefix)
        ),
      on: {
        /**
         * Error handler
         * @param {NodeJS.ErrnoException} err
         * @param {import('express').Request} _req
         * @param {import('express').Response} res
         */
        // @ts-expect-error
        error: (err, _req, res) => {
          switch (err.code) {
            case "ECONNRESET":
            case "ENOTFOUND":
            case "ECONNREFUSED":
            case "ETIMEDOUT":
              res
                .status(504)
                .json({ success: false, message: STATUS_CODES[504] });
              break;
            default:
              res
                .status(500)
                .json({ success: false, message: STATUS_CODES[500] });
              break;
          }
        },
      },
      ...config.proxyOpts,
    })
  );
