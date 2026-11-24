/** One thing the user needs to do. Immutable: a change produces a new Todo. */
export interface Todo {
  /** Unique within a TodoList; assigned on creation; never changes. */
  readonly id: string;
  /** Non-empty after trimming; stored without leading or trailing whitespace. */
  readonly title: string;
  /** False on creation. */
  readonly done: boolean;
}

export type AddResult =
  | { readonly ok: true; readonly todo: Todo }
  | { readonly ok: false; readonly error: "EMPTY_TITLE" };
