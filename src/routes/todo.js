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
    const updatedTodo = updateTodo(id, req.body);

    if (!updatedTodo) {
        return res.status(404).json({ error: "Todo not found" });
    }
    res.json(updatedTodo);
});

router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    deleteTodo(id);
    res.status(204).send();
});

module.exports = router;