import { useTodos } from "../todo-store";
import { TodoItem } from "./TodoItem";

export function TodoListView() {
  const todos = useTodos();

  if (todos.length === 0) {
    return <p role="status">No todos yet</p>;
  }

  return (
    <ul aria-label="Todos">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
