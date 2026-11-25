# Implementation Plan: Second Todo List App (Vue)

**Branch**: `002-vue-todo-app` | **Date**: 2026-11-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-vue-todo-app/spec.md`

## Summary

Add `apps/vue`, a Vue 3 + Vite app with the same behavior as `apps/react`. Same strategy as
feature 001: the app holds one `TodoList` from `@todolist/core` as global state and only
renders it. The one framework-specific piece is a `useTodos` composable that turns the core's
`subscribe` / `getSnapshot` into a Vue ref. The shared Playwright suite in `e2e/` runs
unchanged, through a new root script `e2e:vue`. A root script `dev:vue` starts the app, next to the
existing `dev` for React. Nothing in `apps/react`, `packages/core` or
`e2e/` changes.

## Reuse from feature 001 (not copied here)

| Need | Source of truth |
|---|---|
| Behavior and acceptance scenarios | [001 spec.md](../001-basic-todo-list/spec.md) |
| Todo and TodoList rules | [001 data-model.md](../001-basic-todo-list/data-model.md) |
| Core API and guarantees | [001 contracts/core-api.md](../001-basic-todo-list/contracts/core-api.md) |
| Accessible UI the e2e suite relies on | [001 contracts/ui-contract.md](../001-basic-todo-list/contracts/ui-contract.md) |
| Core without a build step, shared e2e suite, tooling choices | [001 research.md](../001-basic-todo-list/research.md) R1 to R7 |

This feature adds no data-model.md and no contracts/: there is nothing new to define.

## Technical Context

**Language/Version**: TypeScript 7.x (as `apps/react`), Node.js 22.12+ or 24

**Primary Dependencies**: Vue 3.5, Vite 8, `@vitejs/plugin-vue` 6, `vue-tsc` 3 (type-check of `.vue` files); `@todolist/core` as `workspace:*`

**Storage**: None (in memory only, spec FR-006)

**Testing**: The shared Playwright suite in `e2e/`, unchanged. No new unit test: the app has no logic of its own (see [research.md](./research.md) R3)

**Target Platform**: Modern web browsers, desktop and mobile viewports

**Project Type**: One more app in the existing pnpm monorepo

**Performance Goals**: Every action is reflected on screen without visible delay (001 SC-003)

**Constraints**: No business logic in `apps/vue`; no import from `apps/react`; no change to `apps/react`, `packages/core`, `e2e/` or `playwright.config.ts`

**Scale/Scope**: One app of about 5 small components, one composable, one script

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|---|---|---|
| I. Framework-agnostic specifications | PASS | `spec.md` names no framework; Vue appears only in this plan and in the branch name |
| II. Shared core | PASS | Validation, trimming, add, toggle, remove and observation come from `@todolist/core`; `apps/vue` only renders and forwards actions |
| III. Monorepo layout | PASS | New `apps/vue`, matched by the existing `apps/*` workspace glob; no import between apps |
| IV. Test-Driven Development | PASS | The shared e2e suite is the failing test: `apps/vue` is built until `pnpm e2e:vue` is green. No new core code, so no new unit test |
| V. Front-end only and simplicity | PASS | No backend, no persistence, no extra dependency for the e2e script (see R4) |

**Post-design re-check**: all five principles still PASS. No complexity violation to justify.

## Project Structure

### Documentation (this feature)

```text
specs/002-vue-todo-app/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
apps/
└── vue/                         # new
    ├── package.json             # name: @todolist/vue, scripts: dev, build, preview, typecheck
    ├── index.html
    ├── vite.config.ts           # port 5174, strictPort
    ├── tsconfig.json
    └── src/
        ├── main.ts
        ├── App.vue
        ├── todo-store.ts        # single TodoList instance + useTodos composable
        ├── index.css            # done-todo style
        └── components/          # TodoForm.vue, TodoListView.vue, TodoItem.vue (presentation only)

scripts/
└── e2e-vue.sh                   # new: start the Vue app, run the shared suite against it, stop it

package.json                     # root: add the "dev:vue" and "e2e:vue" scripts
```

Unchanged: `apps/react`, `packages/core`, `e2e/` (including `playwright.config.ts`).

**Structure Decision**: One new workspace member, `apps/vue`, mirroring `apps/react` file for
file, so the two apps stay easy to compare. It takes port 5174 so that it can run next to the
React app (5173).

## Complexity Tracking

No constitution violations. Nothing to justify.
