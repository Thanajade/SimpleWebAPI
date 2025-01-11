const express = require("express");
const { getTodos, addTodo, deleteTodo, updateTodo } = require("../models/todo");

const router = express.Router();

router.get("/", (req, res) => {
    res.json(getTodos());
});

router.post("/", (req, res) => {
    const { title, completed } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }
    const newTodo = addTodo({ title, completed: completed || false });
    res.status(201).json(newTodo);
});

router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, completed } = req.body;

    console.log("Received ID:", id);
    console.log("Request Body:", req.body);

    // Validate input data
    if (!title && typeof completed === "undefined") {
        console.error("Invalid input data");
        return res.status(400).json({ error: "Invalid input data" });
    }

    const updatedTodo = updateTodo(id, req.body);

    if (!updatedTodo) {
        console.error("Todo not found for ID:", id);
        return res.status(404).json({ error: "Todo not found" });
    }

    console.log("Updated Todo:", updatedTodo);
    res.json(updatedTodo);
});

router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    deleteTodo(id);
    res.status(204).send();
});

module.exports = router;