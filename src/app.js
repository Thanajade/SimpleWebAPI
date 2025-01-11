const express = require("express");
const todoRoutes = require("./routes/todo");
const healthRoutes = require("./routes/health");

const app = express();

app.use(express.json());
app.use("/todos", todoRoutes);
app.use("/health", healthRoutes);

module.exports = app;