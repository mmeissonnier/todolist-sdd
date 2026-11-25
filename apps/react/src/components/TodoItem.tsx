import type { Todo } from "@todolist/core";
import { todoList } from "../todo-store";

export function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li className={todo.done ? "todo done" : "todo"}>
      <label>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => todoList.toggle(todo.id)}
        />
        <span>{todo.title}</span>
      </label>
    </li>
  );
}
