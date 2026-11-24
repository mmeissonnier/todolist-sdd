# Contract: `@todolist/core` public API

Every app MUST use only this API to read and change the todo list. It is the same for all
frameworks.

```ts
export interface Todo {
  readonly id: string;
  readonly title: string;
  readonly done: boolean;
}

export type AddResult =
  | { readonly ok: true; readonly todo: Todo }
  | { readonly ok: false; readonly error: "EMPTY_TITLE" };

export class TodoList {
  add(title: string): AddResult;
  toggle(id: string): void;
  remove(id: string): void;
  list(): readonly Todo[];                          // same value as getSnapshot()

  subscribe(listener: () => void): () => void;     // returns an unsubscribe function
  getSnapshot(): readonly Todo[];
}
```

## Behavior guarantees

| Guarantee | Details |
|---|---|
| Snapshot stability | `getSnapshot()` returns the same reference until the state changes |
| Immutability | Returned arrays and todos are never mutated; a change produces new ones |
| Notification | Listeners are called once after each successful change, never after a rejected or no-op call |
| Order | Todos stay in the order they were added |
| Unsubscribe | The function returned by `subscribe` stops further notifications for that listener |
| Independence | Each `TodoList` instance has its own state, listeners and id counter |
| No UI dependency | The package imports no UI framework and no browser-only API |
