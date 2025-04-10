//@ts-check
const express = require("express");

const mockServer = express();
mockServer.use(express.json());

mockServer.post("/auth/verify", (req, res) => {
  if (req.body.token === "valid") res.json({ username: "test", success: true });
  else res.status(401).json({ success: false, message: "Unauthorized" });
});

mockServer.get("/questions/status/:status", (req, res) => {
  res.status(parseInt(req.params.status)).json(req.params);
});

mockServer.get("/questions/fail", (req, res) => {
  res.destroy();
});

mockServer.get("/questions/timeout", (req, res) => {});

mockServer.get("/:game/:path", (req, res) => {
  res.json({
    params: req.params,
    query: req.query,
    body: req.body,
  });
});

module.exports = mockServer.listen(9999);
