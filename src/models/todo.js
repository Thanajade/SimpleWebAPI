let todos = [];

function getTodos() {
    return todos;
}

function addTodo(todo) {
    const newTodo = { id: Date.now(), ...todo };
    todos.push(newTodo);
    return newTodo;
}

function updateTodo(id, updatedFields) {
    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
        console.error("Todo not found in updateTodo function for ID:", id);
        return null; // Return null if the todo doesn't exist
    }

    // Update only provided fields
    if (updatedFields.title !== undefined) todo.title = updatedFields.title;
    if (updatedFields.completed !== undefined) todo.completed = updatedFields.completed;

    console.log("Updated Todo in Memory:", todo);
    return todo;
}

function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    return todos;
}



module.exports = { getTodos, addTodo, deleteTodo, updateTodo };