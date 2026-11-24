# Implementation Plan: Basic Todo List

**Branch**: `001-basic-todo-list` | **Date**: 2026-11-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-basic-todo-list/spec.md`

## Summary

Deliver the first implementation of the basic todo list: add, list, toggle done, and remove
todos, with whitespace-only titles rejected. All business logic lives in a framework-free
`TodoList` class in `packages/core` that exposes `subscribe()` and `getSnapshot()` so any UI
framework can observe it. The first UI is a React app in `apps/react` that holds one
`TodoList` instance as global state and reads it with `useSyncExternalStore`. A single
Playwright suite in `e2e/` targets a configurable base URL, so the same tests can later run
against every app. State is in memory only.

## Technical Context

**Language/Version**: TypeScript (latest stable, 7.x at planning time), Node.js 22.12+ or 24

**Primary Dependencies**: React 19, Vite 8, `@vitejs/plugin-react`

**Storage**: None (in memory only, per spec FR-011)

**Testing**: Vitest 5 (unit, `packages/core`); Playwright 1.65 (e2e, shared `e2e/` package)

**Target Platform**: Modern web browsers, desktop and mobile viewports

**Project Type**: pnpm monorepo, front-end only (one shared library, one app, one e2e package)

**Performance Goals**: Every action is reflected on screen without visible delay (spec SC-003)

**Constraints**: No UI dependency in `packages/core`; no business logic in `apps/*`; no backend

**Scale/Scope**: One user, one list, 4 user stories, a few dozen todos at most

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|---|---|---|
| I. Framework-agnostic specifications | PASS | `spec.md` names no framework or library; technology appears only in this plan |
| II. Shared core | PASS | Validation, trimming, add, toggle, remove and observation live in `packages/core`; `apps/react` only renders and forwards user actions |
| III. Monorepo layout | PASS | pnpm workspace with `apps/react`, `packages/core`, `e2e`; apps never import from one another |
| IV. Test-Driven Development | PASS | Vitest tests for the core are written first; one Playwright suite is shared by all apps (see [contracts/ui-contract.md](./contracts/ui-contract.md)) |
| V. Front-end only and simplicity | PASS | No backend, no persistence in this feature (persistence is a later spec), no title editing or filtering |

**Post-design re-check (after Phase 1)**: all five principles still PASS. No complexity
violation to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-basic-todo-list/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── core-api.md      # Public API of packages/core
│   └── ui-contract.md   # Accessible UI contract every app must satisfy for the shared e2e suite
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
package.json                 # root scripts (already exists)
pnpm-workspace.yaml          # packages: apps/*, packages/*, e2e
tsconfig.base.json           # shared compiler options

packages/
└── core/
    ├── package.json         # name: @todolist/core, exports TypeScript source (no build step)
    ├── tsconfig.json
    ├── src/
    │   ├── index.ts         # public exports
    │   ├── types.ts         # All type definitions for the TodoList
    │   └── TodoList.ts      # TodoList class
    └── tests/
        └── todo-list.test.ts

apps/
└── react/
    ├── package.json
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── todo-store.ts    # creates the single TodoList instance
        └── components/      # form, list, item (presentation only)

e2e/
├── package.json             # name: @todolist/e2e
├── playwright.config.ts     # base URL from E2E_BASE_URL
└── tests/
    └── basic-todo-list.spec.ts
```

**Structure Decision**: Three workspace members. `packages/core` holds all behavior and is
consumed as TypeScript source (no build step) to keep tooling minimal. `apps/react` is the
first UI. `e2e/` is a separate package so it depends on no app, which is what lets the same
suite run against `apps/vue`, `apps/angular`, and so on later.

## Complexity Tracking

No constitution violations. Nothing to justify.
