import { useState, type FormEvent } from "react";
import { todoList } from "../todo-store";

export function TodoForm() {
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = todoList.add(title);
    if (result.ok) setTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        aria-label="New todo title"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}
