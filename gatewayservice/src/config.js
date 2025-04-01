// @ts-check

const config = {
  port: process.env.PORT ?? 8000,
  auth: {
    url: (process.env.AUTH_SERVICE_URL ?? "http://localhost:8002") + "/verify",
    paths: ["/game"],
  },
  /** @type {import("http-proxy-middleware").Options} */
  proxyOpts: {
    proxyTimeout: 10_000, // FIXME: Decrease timeout once question service has a cache
    pathRewrite: { "^/[^/]+/?": "" },
    changeOrigin: true,
    logger: console,
  },
};

/** @type {import("http-proxy-middleware").Options['router']} */
config.proxyOpts.router = {
  "/game": process.env.GAME_SERVICE_URL ?? "http://localhost:8001",
  "/auth":
    (process.env.AUTH_SERVICE_URL ?? "http://localhost:8002") + "/public",
  "/stats":
    (process.env.STATS_SERVICE_URL ?? "http://localhost:8003") + "/public",
  "/questions": process.env.QUESTIONS_SERVICE_URL ?? "http://localhost:8004",
};

module.exports = config;
