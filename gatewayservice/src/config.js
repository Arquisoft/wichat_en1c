// @ts-check
const pkg = require("../package.json");

const config = {
  name: `${pkg.name}@${pkg.version}`,
  port: Number(process.env.PORT ?? 8000),
  urls: {
    game: (process.env.GAME_SERVICE_URL ?? "http://localhost:8001") + "/game",
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
    changeOrigin: true,
    logger: undefined,
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
