const express = require("express");
const { getTodos, addTodo, deleteTodo, updateTodo } = require("../models/todo");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID of the to-do item
 *         title:
 *           type: string
 *           description: Title of the to-do item
 *         completed:
 *           type: boolean
 *           description: Indicates whether the to-do is completed
 *       example:
 *         id: 1
 *         title: Learn Docker
 *         completed: false
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Retrieve a list of todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: A list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get("/", (req, res) => {
    res.json(getTodos());
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new to-do item
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: The to-do was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Missing or invalid request body
 */
router.post("/", (req, res) => {
    const { title, completed } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }
    const newTodo = addTodo({ title, completed: completed || false });
    res.status(201).json(newTodo);
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update an existing to-do item
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the to-do to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title for the to-do
 *               completed:
 *                 type: boolean
 *                 description: Updated completion status
 *     responses:
 *       200:
 *         description: The to-do was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Missing or invalid request body
 *       404:
 *         description: To-do not found
 */
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updatedTodo = updateTodo(id, req.body);

    if (!updatedTodo) {
        return res.status(404).json({ error: "Todo not found" });
    }
    res.json(updatedTodo);
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete an existing to-do item
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the to-do to delete
 *     responses:
 *       204:
 *         description: The to-do was successfully deleted
 *       404:
 *         description: To-do not found
 */
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    deleteTodo(id);
    res.status(204).send();
});

module.exports = router;