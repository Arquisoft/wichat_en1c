// @ts-check

module.exports = {
  port: process.env.PORT ?? 8000,
  urls: {
    game: process.env.GAME_SERVICE_URL ?? "http://localhost:8001",
    auth: process.env.AUTH_SERVICE_URL ?? "http://localhost:8002",
    stats: process.env.STATS_SERVICE_URL ?? "http://localhost:8003",
    question: process.env.QUESTIONS_SERVICE_URL ?? "http://localhost:8004",
  },
  publicPath: process.env.PUBLIC_PATH ?? "/public",
  auth: {
    url: (process.env.AUTH_SERVICE_URL ?? "http://localhost:8002") + "/verify",
    paths: ["/game", "/stats"],
  },
  /**
   * @type {import("http-proxy-middleware").Options}
   */
  proxyOpts: {
    proxyTimeout: 10_000, // FIXME: Decrease timeout once question service has a cache
    pathRewrite: { "^/[^/]+/?": "" },
    changeOrigin: true,
    logger: console,
  },
};
