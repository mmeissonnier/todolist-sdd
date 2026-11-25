import type { AddResult, Todo } from "./types";

export type Listener = () => void;

export class TodoList {
  #snapshot: readonly Todo[] = [];
  readonly #listeners = new Set<Listener>();
  #nextId = 1;

  /**
   * Registers a listener called after each change. Returns a function that
   * unregisters it. Defined as an arrow property so it can be passed around
   * unbound (for example to a framework's external-store hook).
   */
  subscribe = (listener: Listener): (() => void) => {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  };

  /** Same reference until the state changes, then a new immutable array. */
  getSnapshot = (): readonly Todo[] => this.#snapshot;

  list(): readonly Todo[] {
    return this.#snapshot;
  }

  /**
   * Appends a new todo that is not done. The title is trimmed; an empty or
   * whitespace-only title is rejected without changing state or notifying.
   */
  add(title: string): AddResult {
    const trimmed = title.trim();
    if (trimmed === "") return { ok: false, error: "EMPTY_TITLE" };
    const todo: Todo = { id: this.#takeId(), title: trimmed, done: false };
    this.#commit([...this.#snapshot, todo]);
    return { ok: true, todo };
  }

  /**
   * Flips the done state of the todo with the given id. An unknown id changes
   * nothing and notifies nobody.
   */
  toggle(id: string): void {
    if (!this.#snapshot.some((todo) => todo.id === id)) return;
    this.#commit(
      this.#snapshot.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  }

  /**
   * Removes the todo with the given id, keeping the order of the others. An
   * unknown id changes nothing and notifies nobody.
   */
  remove(id: string): void {
    if (!this.#snapshot.some((todo) => todo.id === id)) return;
    this.#commit(this.#snapshot.filter((todo) => todo.id !== id));
  }

  /** Replaces the snapshot and notifies listeners once. */
  #commit(next: readonly Todo[]): void {
    this.#snapshot = next;
    for (const listener of this.#listeners) listener();
  }

  /** Returns the next todo id and advances the counter. */
  #takeId(): string {
    return String(this.#nextId++);
  }
}
