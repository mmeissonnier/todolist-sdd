import { TodoForm } from "./components/TodoForm";
import { TodoListView } from "./components/TodoListView";

export function App() {
  return (
    <main className="app">
      <h1 className="app-title">Todo list</h1>
      <TodoForm />
      <TodoListView />
    </main>
  );
}
