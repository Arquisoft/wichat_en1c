// @ts-check
const {
  createProxyMiddleware,
  fixRequestBody,
} = require("http-proxy-middleware");
const { STATUS_CODES } = require("http");
const config = require("./config");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) =>
  app.use(
    createProxyMiddleware({
      router: (req) => config.urls[req.url?.split("/")[1]],
      pathRewrite: { "^/[^/]+/?": "" },
      pathFilter: (path) => config.urls[path.split("/")[1]] !== undefined,
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
        proxyReq: fixRequestBody,
      },
      ...config.proxyOpts,
    })
  );
