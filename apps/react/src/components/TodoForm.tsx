import { useState, type FormEvent } from "react";
import { todoList } from "../todo-store";

export function TodoForm() {
  const [title, setTitle] = useState("");
  const [rejected, setRejected] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = todoList.add(title);
    if (result.ok) {
      setTitle("");
      setRejected(false);
    } else {
      setRejected(true);
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-form-input"
        aria-label="New todo title"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit" className="todo-form-submit">Add</button>
      {rejected && <p role="alert" className="todo-form-error">A title is required</p>}
    </form>
  );
}
