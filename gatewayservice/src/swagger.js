// @ts-check
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

const openapiPath = "./openapi.yaml";

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  if (fs.existsSync(openapiPath)) {
    try {
      const file = fs.readFileSync(openapiPath, "utf8");
      const swaggerDocument = YAML.parse(file);
      app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } catch (err) {
      console.error("Error parsing OpenAPI file:", err.message);
    }
  } else {
    console.log("Not configuring OpenAPI. Configuration file not present.");
  }
};
