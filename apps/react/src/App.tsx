import { TodoForm } from "./components/TodoForm";
import { TodoListView } from "./components/TodoListView";

export function App() {
  return (
    <main>
      <h1>Todo list</h1>
      <TodoForm />
      <TodoListView />
    </main>
  );
}
