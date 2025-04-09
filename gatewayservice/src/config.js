// @ts-check

const config = {
  port: process.env.PORT ?? 8000,
  urls: {
    game: (process.env.GAME_SERVICE_URL ?? "http://localhost:8001") + "/game", // TODO: remove /game from URL
    auth: (process.env.AUTH_SERVICE_URL ?? "http://localhost:8002") + "/public",
    stats:
      (process.env.STATS_SERVICE_URL ?? "http://localhost:8003") + "/public",
    questions: process.env.QUESTIONS_SERVICE_URL ?? "http://localhost:8004",
  },
  auth: {
    url: (process.env.AUTH_SERVICE_URL ?? "http://localhost:8002") + "/verify",
    paths: ["/game", "/stats"],
  },
  /** @type {import("http-proxy-middleware").Options} */
  proxyOpts: {
    proxyTimeout: 10_000, // FIXME: Decrease timeout once question service has a cache
    changeOrigin: true,
    logger: console,
  },
  /** @type {import("cors").CorsOptions} */
  cors: {},
  /** @type {import("helmet").HelmetOptions} */
  helmet: {
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: {
      directives: {
        upgradeInsecureRequests: null,
        connectSrc: "*",
      },
    },
  },
};

module.exports = config;
