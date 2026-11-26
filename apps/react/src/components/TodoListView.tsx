import { todoList, useTodos } from "../todo-store";
import { TodoItem } from "./TodoItem";

export function TodoListView() {
  const todos = useTodos();

  if (todos.length === 0) {
    return <p role="status" className="todo-empty">No todos yet</p>;
  }

  return (
    <ul className="todo-list" aria-label="Todos">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => todoList.toggle(todo.id)}
          onRemove={() => todoList.remove(todo.id)}
        />
      ))}
    </ul>
  );
}
