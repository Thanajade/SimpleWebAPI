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
        // Add a new todo
        const addRes = await request(app)
            .post("/todos")
            .send({ title: "Old Title", completed: false });
        const id = addRes.body.id;

        // Update the todo
        const updateRes = await request(app)
            .put(`/todos/${id}`)
            .send({ title: "Updated Title", completed: true });

        expect(updateRes.statusCode).toBe(200);
        expect(updateRes.body).toHaveProperty("id", id);
        expect(updateRes.body.title).toBe("Updated Title");
        expect(updateRes.body.completed).toBe(true);

        // Verify the update
        const getRes = await request(app).get(`/todos`);
        expect(getRes.body.find((todo) => todo.id === id).title).toBe("Updated Title");
    });
});