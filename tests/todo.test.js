const request = require("supertest");
const app = require("../src/app");

describe("To-Do API", () => {
    it("should retrieve all todos", async () => {
        const res = await request(app).get("/todos");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("should add a new todo", async () => {
        const res = await request(app)
            .post("/todos")
            .send({ title: "Test Todo", completed: false });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.title).toBe("Test Todo");
    });

    it("should delete a todo", async () => {
        const addRes = await request(app)
            .post("/todos")
            .send({ title: "Test Todo", completed: false });
        const id = addRes.body.id;

        const deleteRes = await request(app).delete(`/todos/${id}`);
        expect(deleteRes.statusCode).toBe(204);
    });

    it("should update an existing todo", async () => {
        const initialData = { title: "Old Title", completed: false };

        // Add a new todo
        const addRes = await request(app)
            .post("/todos")
            .send(initialData);
        const id = addRes.body.id;

        expect(id).toBeDefined(); // Ensure the ID is valid

        const updatedData = { title: "Updated Title", completed: true };

        // Update the todo
        const updateRes = await request(app)
            .put(`/todos/${id}`)
            .send(updatedData);

        expect(updateRes.statusCode).toBe(200); // Ensure the update succeeds
        expect(updateRes.body).toHaveProperty("id", id);
        expect(updateRes.body.title).toBe(updatedData.title);
        expect(updateRes.body.completed).toBe(updatedData.completed);

        // Verify the update
        const getRes = await request(app).get(`/todos`);
        const updatedTodo = getRes.body.find((todo) => todo.id === id);

        expect(updatedTodo).toBeDefined(); // Ensure the todo exists
        expect(updatedTodo).toHaveProperty("title", updatedData.title);
        expect(updatedTodo.completed).toBe(updatedData.completed);
    });
});