const express = require("express");
const todoRoutes = require("./routes/todo");
const healthRoutes = require("./routes/health");
const { swaggerUi, swaggerDocs } = require("./swagger");

const app = express();

app.use(express.json());
app.use("/todos", todoRoutes);
app.use("/health", healthRoutes);

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;