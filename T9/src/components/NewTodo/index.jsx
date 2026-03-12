import "./style.css";
import { useState } from "react";

function NewTodo( {onAdd } ) {
    const [text, setText] = useState("");

    function handleSubmit() {
        if (text === "") {
            return
        }
        onAdd(text);
        setText("");
    }
    return (
        <div className="new-todo row">
            <input type="text"
            placeholder="Enter a new task"
            value={text}
            onChange={(e) => setText(e.target.value)}
            />
        <button onClick={handleSubmit}>+</button>
        </div>
    ) 

}

export default NewTodo;
