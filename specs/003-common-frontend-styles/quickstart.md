# Quickstart: Validating Common Frontend Styles

Prerequisites: `pnpm install` at the repo root.

1. **Tokens and rules (red then green)**: `pnpm --filter @todolist/design-tokens test`. Expect: required tokens present, one file per component, no raw color/size literals.
2. **Type and build**: `pnpm typecheck`, then `pnpm --filter @todolist/react build` and `pnpm --filter @todolist/vue build`. Expect: both succeed and emit CSS containing the theme.
3. **Shared rules resolve**: in each built CSS, the `todo-form-submit` and `todo-item` rules exist (confirms `@apply` of DaisyUI classes works; otherwise use the fallback in research.md section 4).
4. **Behavior unchanged**: `pnpm e2e` (React) and `pnpm e2e:vue` (Vue). Expect: all existing tests pass.
5. **Visual review (manual)**: run `pnpm dev` and `pnpm dev:vue`; compare both pages side by side in these states: empty, with items, one item completed, invalid submit (error shown), keyboard focus, window at 320 px and 1920 px. Expect: no visible difference (SC-001, SC-006).
6. **One-edit check**: change `primary` in `tokens.css`; both apps show the new color with no other file edited (SC-002). Revert.
7. **Extensibility check**: add a throwaway component file and import line; no existing component file changes (SC-003). Revert.
