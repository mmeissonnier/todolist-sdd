import type { Todo } from "@todolist/core";
import { todoList } from "../todo-store";

export function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li className={todo.done ? "todo done" : "todo"}>
      <label>
        <input
          className="todo-check"
          type="checkbox"
          checked={todo.done}
          onChange={() => todoList.toggle(todo.id)}
        />
        <span className="todo-title">{todo.title}</span>
      </label>
      <button type="button" className="todo-delete" onClick={() => todoList.remove(todo.id)}>
        Delete {todo.title}
      </button>
    </li>
  );
}
