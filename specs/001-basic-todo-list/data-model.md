# Data Model: Basic Todo List

## Todo

One thing the user needs to do. Immutable: a change produces a new `Todo`.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Unique within a `TodoList`; assigned on creation; never changes |
| `title` | string | Non-empty after trimming; stored without leading or trailing whitespace (FR-004, FR-005) |
| `done` | boolean | `false` on creation (FR-010) |

Two todos may share the same title; they are distinguished by `id`.

## TodoList

The ordered collection of todos, in the order they were added (FR-002).

| Member | Description |
|---|---|
| state | `readonly Todo[]`, in memory only (FR-011) |
| listeners | Set of functions notified after each state change |
| next id | Counter used to assign the next `Todo.id` |

### Validation rules

- A title that is empty or whitespace-only (spaces, tabs, line breaks) is rejected; the
  state is unchanged and no listener is notified (FR-004).
- A valid title is trimmed before being stored (FR-005).

### State transitions

```text
add(valid title)   -> new todo appended, done = false        -> listeners notified
add(invalid title) -> state unchanged                        -> no notification
toggle(id)         -> that todo's done flipped; others kept   -> listeners notified
toggle(unknown id) -> state unchanged                        -> no notification
remove(id)         -> that todo removed; order of others kept -> listeners notified
remove(unknown id) -> state unchanged                        -> no notification
```

A todo's lifecycle: created (`done = false`) <-> done (`done = true`) -> removed.
