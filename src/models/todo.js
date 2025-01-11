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
    if (!todo) return null;

    Object.assign(todo, updatedFields);
    return todo;
}

function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    return todos;
}



module.exports = { getTodos, addTodo, deleteTodo, updateTodo };

module.exports = { getTodos, addTodo, deleteTodo };