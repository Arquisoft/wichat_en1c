const express = require("express");

const app = express();
const port = 9997; // Port for the mock server

// Example route
app.get("/", (req, res) => {
  const query = req.query.query;
  if (query?.includes("DISTINCT")) {
    const limit = Number(query.match(/LIMIT\s+(\d+)/i)[1]);
    res.json({
      head: {
        vars: ["entity", "name"],
      },
      results: {
        bindings: Array(limit).fill({
          entity: {
            type: "uri",
            value: "http://www.wikidata.org/entity/Q2908",
          },
          name: {
            "xml:lang": "en",
            type: "literal",
            value: "Antoine de Saint-Exupéry",
          },
        }),
      },
    });
  } else
    res.json({
      head: {
        vars: ["birthDate", "image"],
      },
      results: {
        bindings: [
          {
            birthDate: {
              datatype: "http://www.w3.org/2001/XMLSchema#dateTime",
              type: "literal",
              value: "-0064-12-06T00:00:00Z",
            },
            image: {
              type: "uri",
              value:
                "http://commons.wikimedia.org/wiki/Special:FilePath/Quintus%20Horatius%20Flaccus.jpg",
            },
          },
        ],
      },
    });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
module.exports = app.listen(port);
