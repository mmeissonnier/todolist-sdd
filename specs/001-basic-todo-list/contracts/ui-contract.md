# Contract: UI exposed to the shared e2e suite

Every app (React now; Vue, Angular, Svelte, Solid later) MUST expose exactly this UI. The
Playwright suite in `e2e/` locates elements only through these accessible names, so it never
depends on a framework or on CSS classes.

| Element | Role | Accessible name / text |
|---|---|---|
| Title input | `textbox` | `New todo title` |
| Add button | `button` | `Add` |
| Todo list | `list` | `Todos` |
| Todo item | `listitem` | contains the todo title |
| Done toggle | `checkbox` inside the item | the todo title; checked when done |
| Delete button | `button` inside the item | `Delete <title>` |
| Validation message | `alert` | `A title is required` |
| Empty state | `status` | `No todos yet` |

## Behavior

- Submitting the form (Add button or Enter key) calls the core `add`.
- After a successful add: the input is cleared; no alert is shown.
- After a rejected add: the input is unchanged; the alert is shown; the list is unchanged.
- The alert disappears after the next successful add.
- The empty state is shown only when the list has no todos; the `list` is then not shown.
- A done todo is visually distinguished, and its checkbox is checked.
- The page always starts with an empty list (no persistence).
