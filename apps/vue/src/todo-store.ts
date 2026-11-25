import { TodoList, type Todo } from "@todolist/core";
import { onMounted, onUnmounted, shallowRef, type Ref } from "vue";

/** The single TodoList instance: the app's global state. */
export const todoList = new TodoList();

/** Current todos; the caller re-renders whenever the list changes. */
export function useTodos(): Readonly<Ref<readonly Todo[]>> {
  const todos = shallowRef(todoList.getSnapshot());
  let unsubscribe: (() => void) | undefined;

  onMounted(() => {
    // Catch up with changes made between setup and mount, then follow the core.
    todos.value = todoList.getSnapshot();
    unsubscribe = todoList.subscribe(() => {
      todos.value = todoList.getSnapshot();
    });
  });
  onUnmounted(() => unsubscribe?.());

  return todos;
}
