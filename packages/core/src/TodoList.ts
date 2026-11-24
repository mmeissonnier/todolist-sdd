import type { Todo } from "./types";

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
