// @ts-check
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

const openapiPath = "./openapi.yaml";

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  if (!fs.existsSync(openapiPath))
    return console.warn(
      "Not configuring OpenAPI. Configuration file not present."
    );

  try {
    app.use(
      "/api-doc",
      swaggerUi.serve,
      swaggerUi.setup(YAML.parse(fs.readFileSync(openapiPath, "utf8")))
    );
  } catch (err) {
    console.error("Error parsing OpenAPI file:", err.message);
  }
};
