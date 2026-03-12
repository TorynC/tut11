import { useState } from "react";
import "./App.css";
import TodoItem from "./components/TodoItem";
import NewTodo from "./components/NewTodo";

// You can use this to seed your TODO list
const seed = [
    { id: 0, text: "Submit assignment 2", completed: false },
    { id: 1, text: "Reschedule the dentist appointment", completed: false },
    { id: 2, text: "Prepare for CSC309 exam", completed: false },
    { id: 3, text: "Find term project partner", completed: true },
    { id: 4, text: "Learn React Hooks", completed: false },
];

function App() {
    const [todo, setTodo] = useState(seed);

    function addTodo(text) {
        const newTodo = {id: Date.now(), text: text, completed: false};
        setTodo([...todo, newTodo]);
    }

    function deleteTodo(id) {
        const newTodos = todo.filter((item) => item.id !== id);
        setTodo(newTodos);
        
    }

    function toggleTodo(id) {
        const newTodos = todo.map((item) => {
            if (item.id === id) {
                return { ...item, completed:!item.completed};
            }
            return item;
        })
        setTodo(newTodos);
    }

    return (
        <div className="app">
            <h1>My ToDos</h1>
            <NewTodo onAdd={addTodo}></NewTodo>
            <ul className="todo-list">
                {todo.map((item) => (
                    <TodoItem key={item.id}
                    todo={item} onDelete={deleteTodo} 
                    onToggle={toggleTodo}>
                    </TodoItem>
                ))}
            </ul>
        </div>
        
    );
}

export default App;
