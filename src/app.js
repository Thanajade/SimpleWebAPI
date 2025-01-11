const express = require("express");
const todoRoutes = require("./routes/todo");

const app = express();

app.use(express.json());
app.use("/todos", todoRoutes);

module.exports = app;