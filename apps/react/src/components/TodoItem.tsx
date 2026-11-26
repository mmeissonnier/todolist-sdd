import type { Todo } from "@todolist/core";

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onRemove: () => void;
}

export function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  return (
    <li className={todo.done ? "todo done" : "todo"}>
      <label>
        <input
          className="todo-check"
          type="checkbox"
          checked={todo.done}
          onChange={onToggle}
        />
        <span className="todo-title">{todo.title}</span>
      </label>
      <button type="button" className="todo-delete" onClick={onRemove}>
        Delete {todo.title}
      </button>
    </li>
  );
}
