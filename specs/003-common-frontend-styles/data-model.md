# Data Model: Common Frontend Styles

No persisted data. The entities are style definitions.

## Design value (token)

| Group | Names (minimal set) | Notes |
|-------|--------------------|-------|
| Colors | `base-100`, `base-200`, `base-300`, `base-content`, `primary`, `primary-content`, `error`, `success` | DaisyUI theme color roles; AA contrast against their `*-content` pair |
| Fonts | `--font-sans` | System font stack; no webfont loaded |
| Sizes | `--text-sm`, `--text-base`, `--text-lg`, `--text-2xl`; `--spacing` base step; `--container-app` max width | Tailwind `@theme` |
| Radii | `--radius-field`, `--radius-box` | DaisyUI theme radii |

Rules: defined once in `tokens.css`; referenced by name everywhere else; adding a token = one line.

## Global rule (`base.css`)

Page background and text color from tokens, base font family and size, centered content column using `--container-app`, small-screen padding.

## Component style (`components/*.css`)

| Unit | Element | States |
|------|---------|--------|
| `todo-form` | form, text input, add button, validation message | hover, focus, disabled, error |
| `todo-list` | list container | none |
| `todo-item` | item row, checkbox, title, delete button | active, completed (struck through, muted), hover, focus |
| `todo-empty` | empty-state message | none |

Rules: built only from tokens/DaisyUI classes; one file per unit; no unit references another's file.
