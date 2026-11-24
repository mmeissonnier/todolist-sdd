import { TodoList, type Todo } from "@todolist/core";
import { useSyncExternalStore } from "react";

/** The single TodoList instance: the app's global state. */
export const todoList = new TodoList();

/** Current todos; re-renders the caller whenever the list changes. */
export function useTodos(): readonly Todo[] {
  return useSyncExternalStore(todoList.subscribe, todoList.getSnapshot);
}
