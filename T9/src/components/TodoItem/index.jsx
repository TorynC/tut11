import "./style.css";
import trashIcon from "./trash.webp";

function TodoItem({todo, onDelete, onToggle}) {
    return (
        <li className="todo-item row">
            <input type="checkbox" 
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            />
            <span className={todo.completed ? "completed" : ""}>{todo.text}</span>
            <a onClick={() => onDelete(todo.id)}>
                <img src={trashIcon} alt="Delete" />
            </a>
        </li>
    )

}

export default TodoItem;