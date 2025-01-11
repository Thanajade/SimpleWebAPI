let todos = [];

function getTodos() {
    return todos;
}

function addTodo(todo) {
    const newTodo = { id: Date.now(), ...todo };
    todos.push(newTodo);
    return newTodo;
}

function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    return todos;
}

module.exports = { getTodos, addTodo, deleteTodo };