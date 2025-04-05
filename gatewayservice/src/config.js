// @ts-check

const config = {
  port: process.env.PORT ?? 8000,
  urls: {
    game: process.env.GAME_SERVICE_URL ?? "http://localhost:8001",
    auth: (process.env.AUTH_SERVICE_URL ?? "http://localhost:8002") + "/public",
    stats:
      (process.env.STATS_SERVICE_URL ?? "http://localhost:8003") + "/public",
    questions: process.env.QUESTIONS_SERVICE_URL ?? "http://localhost:8004",
  },
  auth: {
    url: (process.env.AUTH_SERVICE_URL ?? "http://localhost:8002") + "/verify",
    paths: ["/game"],
  },
  /** @type {import("http-proxy-middleware").Options} */
  proxyOpts: {
    proxyTimeout: 10_000, // FIXME: Decrease timeout once question service has a cache
    changeOrigin: true,
    logger: console,
  },
};

module.exports = config;
