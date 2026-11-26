# UI Contract: Shared Class Names

Every app MUST apply these class names to equivalent elements. Behavior, text and accessibility attributes are unchanged.

| Class | Element | Modifier |
|-------|---------|----------|
| `app` | main page container | none |
| `app-title` | page heading | none |
| `todo-form` | form | none |
| `todo-form-input` | text input | none |
| `todo-form-submit` | add button | none |
| `todo-form-error` | validation message (`role="alert"`) | none |
| `todo-list` | `ul` | none |
| `todo` | item `li` | `done` when completed (existing) |
| `todo-check` | checkbox | none |
| `todo-title` | title `span` | none |
| `todo-delete` | delete button | none |
| `todo-empty` | empty-state message (`role="status"`) | none |

Rules:
- Selectors in the e2e suite (roles, labels) MUST keep working; class names are additive.
- A new component adds its own prefix and its own file in `packages/design-tokens/src/components/`.
- Apps MUST NOT add visual rules of their own for these elements.
