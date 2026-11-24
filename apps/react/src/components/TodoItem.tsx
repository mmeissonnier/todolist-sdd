import type { Todo } from "@todolist/core";

export function TodoItem({ todo }: { todo: Todo }) {
  return <li>{todo.title}</li>;
}
