// @ts-check
const { randomUUID } = require("crypto");
const { pinoHttp } = require("pino-http");
const { STATUS_CODES } = require("http");

/** @type {import("pino").Logger} */
let log;
/** @type {import("mongoose")} */
let mongoose;
/** @type {import("http").Server} */
let server;

/**
 * Sets up the logger for the application.
 *
 * @param {import("express").Application} app Express application
 * @param {string} name Application name
 */
function setupLogger(app, name) {
  const pino = pinoHttp({
    name,
    genReqId: () => randomUUID(),
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    base: {
      pid: undefined,
    },
    transport: {
      targets: [
        {
          target: "pino-pretty",
        },
      ],
    },
  });

  log = pino.logger;
  app.use(pino);
}

/**
 * Default handlers for 404 and unhandled errors.
 *
 * ⚠️ IMPORTANT: This function must be called after all other routes.
 *
 * @param {import("express").Application} app Express application
 */
function setupDefaultHandlers(app) {
  if (log == null) throw new Error("Not setup! Call 'setup' first");

  // Default Handler
  app.use("*star", (_req, res) => {
    res.status(404).json({
      success: false,
      message: STATUS_CODES[404],
    });
  });

  // Error Handler
  app.use((err, req, res, _next) => {
    req.log.error(err, "unhandled error");
    if (!res.writableEnded) {
      const status = (err.expose ? err.status : undefined) ?? 500;
      res
        .status(status)
        .json({ success: false, message: STATUS_CODES[status] });
    }
  });
}

/**
 * Connects to the MongoDB database.
 * @param {string} uri MongoDB URI
 */
async function connectDB(uri) {
  if (log == null) throw new Error("Not setup! Call 'setup' first");

  log.debug("connecting to db");
  try {
    // Dynamic import
    mongoose = require("mongoose");

    await mongoose.connect(uri);
    log.debug("connected to db");
  } catch (err) {
    log.fatal(err, "unable to connect to db");
    process.exit(1);
  }
}

/**
 * Starts the server and listens on the specified port.
 * @param {import("express").Application} app Express application
 * @param {number} port Port to listen on
 * @returns Server instance
 */
function startServer(app, port) {
  if (log == null) throw new Error("Not setup! Call 'setup' first");

  log.debug("starting server");
  server = app.listen(port, (err) => {
    if (err == null) log.info(`started! listening at http://localhost:${port}`);
    else {
      log.fatal(err, "unable to start server");
      server.close();
    }
  });

  // Handle shutdown gracefully
  server.on("close", async () => {
    await mongoose?.connection
      ?.close()
      .catch((err) => log?.warn("unable to disconnect from db", err));

    log?.info("shutdown complete");
    log?.flush();
  });

  const shutdown = () => {
    log?.warn("shutting down");
    server.close();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return server;
}

module.exports = {
  setupLogger,
  setupDefaultHandlers,
  connectDB,
  startServer,
};
