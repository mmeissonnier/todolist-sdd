---

description: "Task list for the basic todo list feature"
---

# Tasks: Basic Todo List

**Input**: Design documents from `/specs/001-basic-todo-list/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/core-api.md, contracts/ui-contract.md, quickstart.md

**Tests**: REQUIRED. Constitution principle IV (Test-Driven Development, NON-NEGOTIABLE) applies: in every phase, tests are written first and MUST be observed failing before the implementation tasks start.

**Organization**: Tasks are grouped by user story. Each story adds core behavior (`packages/core`), then UI (`apps/react`), and is verified by unit tests and by the shared e2e suite (`e2e/`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: User story the task belongs to (US1 to US4)
- Field constraints are defined in `data-model.md`; tasks cite them as `data-model.md` `Todo.<field>` instead of repeating them

## Path Conventions

- Shared logic: `packages/core/src/`, unit tests in `packages/core/tests/`
- React app: `apps/react/src/`
- Shared e2e suite: `e2e/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the pnpm monorepo from scratch, per the plan's Project Structure

- [X] T001 Create `pnpm-workspace.yaml` (packages: `apps/*`, `packages/*`, `e2e`) and `tsconfig.base.json` at the repository root
- [X] T002 [P] Scaffold `packages/core`: `package.json` (name `@todolist/core`, `exports` pointing to `src/index.ts`, Vitest dev dependency, `test` script, no runtime dependency), `tsconfig.json`, empty `src/index.ts`
- [X] T003 [P] Scaffold `apps/react`: `package.json` (name `@todolist/react`, React 19, Vite 8, `@vitejs/plugin-react`, `@todolist/core` as `workspace:*`), `index.html`, `vite.config.ts`, `tsconfig.json`, minimal `src/main.tsx`
- [X] T004 [P] Scaffold `e2e`: `package.json` (name `@todolist/e2e`, `@playwright/test`, `test` script), `tsconfig.json`, `playwright.config.ts` reading the base URL from `E2E_BASE_URL` and starting `@todolist/react` when it is unset (see research.md R6)
- [X] T005 Add root scripts to `package.json`: `test` (core unit tests), `dev` (React app), `e2e`, `typecheck`
- [X] T006 Run `pnpm install` and `pnpm exec playwright install chromium`, then run `pnpm -r exec tsc --noEmit`. If TypeScript 7 is not supported by a tool, downgrade to 5.x and record it in `specs/001-basic-todo-list/research.md` (R7)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The observable core skeleton and the React plumbing that every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 [P] Write failing tests in `packages/core/tests/snapshot.test.ts`: a new `TodoList` has an empty snapshot, `getSnapshot()` returns the same reference on repeated calls, `list()` equals `getSnapshot()` (contracts/core-api.md, "Snapshot stability"); instance independence is tested in T013 because it needs a state change
- [X] T008 Run `pnpm --filter @todolist/core test` and confirm the T007 tests fail
- [X] T009 [P] Define the `Todo` and `AddResult` types in `packages/core/src/types.ts` per contracts/core-api.md and `data-model.md` `Todo.id`, `Todo.title`, `Todo.done`
- [X] T010 Implement the `TodoList` skeleton in `packages/core/src/TodoList.ts` (state, listener set, `subscribe` returning an unsubscribe function, `getSnapshot`, `list`, internal notify method, id counter per research.md R4) and export it from `packages/core/src/index.ts`; the T007 tests pass
- [X] T011 [P] Create the single `TodoList` instance and a `useTodos` hook built on `useSyncExternalStore` in `apps/react/src/todo-store.ts`
- [X] T012 [P] Create the app shell in `apps/react/src/App.tsx` (page heading only) and mount it from `apps/react/src/main.tsx`; confirm `pnpm --filter @todolist/react dev` serves the page

**Checkpoint**: Foundation ready, user story implementation can begin

---

## Phase 3: User Story 1 - Add and see todos (Priority: P1) 🎯 MVP

**Goal**: The user adds a todo by title and sees it in the list, newest last.

**Independent Test**: Add a few todos and check that each appears with the entered title, not done, and that the input is cleared (spec User Story 1).

### Tests for User Story 1 ⚠️

> **Write these tests FIRST and ensure they FAIL before implementation**

- [X] T013 [P] [US1] Write failing tests in `packages/core/tests/add.test.ts`: add appends a todo with the given title and `done` false (`data-model.md` `Todo.done`), ids are unique even for equal titles (`data-model.md` `Todo.id`), insertion order is kept, one notification per add, snapshot reference changes, two instances keep independent state and listeners (contracts/core-api.md, "Independence"), and after the function returned by `subscribe` is called the listener is no longer notified (contracts/core-api.md, "Unsubscribe")
- [X] T014 [P] [US1] Write failing e2e scenarios in `e2e/tests/add-and-list.spec.ts` for the User Story 1 acceptance scenarios (initial empty state, add one todo, add a second after the first, input cleared), locating elements as in contracts/ui-contract.md
- [X] T015 [US1] Run `pnpm --filter @todolist/core test` and `pnpm --filter @todolist/e2e test` and confirm the T013 and T014 tests fail

### Implementation for User Story 1

- [X] T016 [US1] Implement `add` in `packages/core/src/TodoList.ts`: assign `id` from the counter (`data-model.md` `Todo.id`), start with `done` false (`data-model.md` `Todo.done`), append, create a new snapshot, notify once, return `{ ok: true, todo }`. Title validation and trimming (`data-model.md` `Todo.title`) are deliberately left to T025 in User Story 2, so until then the title is stored as received
- [X] T017 [P] [US1] Create `apps/react/src/components/TodoItem.tsx` rendering a todo's title inside a list item
- [X] T018 [US1] Create `apps/react/src/components/TodoListView.tsx` rendering the `Todos` list from the `useTodos` snapshot, and the `No todos yet` status when it is empty (depends on T017)
- [X] T019 [P] [US1] Create `apps/react/src/components/TodoForm.tsx` with the `New todo title` input and the `Add` button; on submit it calls `add` and clears the input on success
- [X] T020 [US1] Compose `TodoForm` and `TodoListView` in `apps/react/src/App.tsx` (depends on T018, T019)
- [X] T021 [US1] Run core unit tests and the e2e suite; the T013 and T014 tests pass

**Checkpoint**: User Story 1 is fully functional and testable on its own (MVP). Known limit at this checkpoint: empty and whitespace-only titles are still accepted, because validation (FR-004, FR-005) is delivered by User Story 2. Do not ship the MVP without it

---

## Phase 4: User Story 2 - Reject invalid titles (Priority: P2)

**Goal**: Empty or whitespace-only titles are refused with a message, and valid titles are trimmed.

**Independent Test**: Submit an empty and a whitespace-only title and check the list is unchanged and `A title is required` is shown (spec User Story 2).

### Tests for User Story 2 ⚠️

- [X] T022 [P] [US2] Write failing tests in `packages/core/tests/validation.test.ts`: empty, spaces-only, tab-only and line-break-only titles return `{ ok: false, error: "EMPTY_TITLE" }`, leave the snapshot reference unchanged and trigger no notification; `"  Buy milk  "` is stored as `"Buy milk"` (`data-model.md` `Todo.title`)
- [X] T023 [P] [US2] Write failing e2e scenarios in `e2e/tests/reject-invalid-title.spec.ts`: empty title and spaces-only title show the alert and leave the list unchanged; the alert disappears after the next successful add; a title with surrounding spaces appears trimmed
- [X] T024 [US2] Run core and e2e tests and confirm the T022 and T023 tests fail

### Implementation for User Story 2

- [X] T025 [US2] Add title validation and trimming to `add` in `packages/core/src/TodoList.ts` per `data-model.md` `Todo.title`, returning `{ ok: false, error: "EMPTY_TITLE" }` without changing state or notifying
- [X] T026 [US2] Update `apps/react/src/components/TodoForm.tsx` to show the `A title is required` alert on a rejected add, keep the input unchanged, and hide the alert after the next successful add
- [X] T027 [US2] Run core unit tests and the e2e suite; the T022 and T023 tests pass and the User Story 1 tests still pass

**Checkpoint**: User Stories 1 and 2 both work

---

## Phase 5: User Story 3 - Mark a todo as done or not done (Priority: P2)

**Goal**: The user toggles a todo between done and not done; done todos look different.

**Independent Test**: Add a todo, mark it done, check its appearance, mark it not done (spec User Story 3).

### Tests for User Story 3 ⚠️

- [X] T028 [P] [US3] Write failing tests in `packages/core/tests/toggle.test.ts`: toggling flips `done` and toggling again flips it back (`data-model.md` `Todo.done`), other todos keep their state, a previous snapshot is not modified, one notification per toggle, an unknown id changes nothing and notifies nobody
- [X] T029 [P] [US3] Write failing e2e scenarios in `e2e/tests/toggle-done.spec.ts`: mark done (checkbox checked, position kept), mark not done again, other todos unaffected
- [X] T030 [US3] Run core and e2e tests and confirm the T028 and T029 tests fail

### Implementation for User Story 3

- [X] T031 [US3] Implement `toggle` in `packages/core/src/TodoList.ts`: replace the matching todo with a copy whose `done` is flipped (`data-model.md` `Todo.done`), create a new snapshot, notify once; do nothing for an unknown id
- [X] T032 [US3] Update `apps/react/src/components/TodoItem.tsx` with a checkbox named by the todo title that calls `toggle`, and add a visual style for done todos in `apps/react/src/index.css` (imported from `apps/react/src/main.tsx`)
- [X] T033 [US3] Run core unit tests and the e2e suite; the T028 and T029 tests pass and earlier stories still pass

**Checkpoint**: User Stories 1 to 3 work

---

## Phase 6: User Story 4 - Delete a todo (Priority: P3)

**Goal**: The user removes any todo, done or not.

**Independent Test**: Add two todos, delete one, check only the other remains (spec User Story 4).

### Tests for User Story 4 ⚠️

- [X] T034 [P] [US4] Write failing tests in `packages/core/tests/remove.test.ts`: removing deletes only the matching todo and keeps the order of the others, removing a done todo works the same way, removing the last todo gives an empty snapshot, one notification per removal, an unknown id changes nothing and notifies nobody; plus a sequence test where a mix of add, toggle and remove calls ends with exactly the todos added and not removed, each with its latest done state (spec SC-005)
- [X] T035 [P] [US4] Write failing e2e scenarios in `e2e/tests/delete-todo.spec.ts`: delete one of several todos, delete a done todo, delete the last todo and see `No todos yet`
- [X] T036 [US4] Run core and e2e tests and confirm the T034 and T035 tests fail

### Implementation for User Story 4

- [X] T037 [US4] Implement `remove` in `packages/core/src/TodoList.ts`: build a new snapshot without the matching todo (`data-model.md` `Todo.id`), notify once; do nothing for an unknown id
- [X] T038 [US4] Update `apps/react/src/components/TodoItem.tsx` with a `Delete <title>` button that calls `remove`
- [X] T039 [US4] Run core unit tests and the e2e suite; the T034 and T035 tests pass and earlier stories still pass

**Checkpoint**: All four user stories work

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Guard the constitution and finish the feature

- [ ] T040 [P] Add `packages/core/tests/purity.test.ts` asserting `packages/core/package.json` has no runtime dependency and no file in `packages/core/src/` imports anything but relative modules (constitution principle II)
- [ ] T041 [P] Write the root `README.md`: what the project is, the commands from quickstart.md, and how to add a framework (create `apps/<framework>`, satisfy contracts/ui-contract.md, reuse `@todolist/core`, run the shared e2e suite with `E2E_BASE_URL`)
- [ ] T042 Run `pnpm -r exec tsc --noEmit` and fix any type error in every package
- [ ] T043 Run the full validation from `specs/001-basic-todo-list/quickstart.md`: unit tests, e2e tests started by the config, e2e tests against a running app with `E2E_BASE_URL`, and the manual check list

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependency
- **Foundational (Phase 2)**: depends on Setup, blocks all user stories
- **User Stories (Phases 3 to 6)**: depend on Foundational, then run in priority order (US1, US2, US3, US4)
- **Polish (Phase 7)**: depends on all user stories

### User Story Dependencies

- **US1 (P1)**: starts after Foundational, no other dependency
- **US2 (P2)**: builds on `add` and `TodoForm` from US1 (same files)
- **US3 (P2)**: needs a todo to exist (US1); touches `TodoList.ts` and `TodoItem.tsx`
- **US4 (P3)**: needs a todo to exist (US1); touches `TodoList.ts` and `TodoItem.tsx`

The stories share `packages/core/src/TodoList.ts` and the React components, so the implementation tasks run sequentially in priority order. Only the test-writing tasks are independent across stories.

### Within Each User Story

- Tests first, then a task that confirms they fail, then core implementation, then UI, then a task that confirms they pass
- Core before UI: the UI only calls the core API

### Parallel Opportunities

- Setup: T002, T003, T004 together
- Foundational: T007 with T009; T011 with T012
- Within a story: the core test file and the e2e spec file can be written together (for example T013 and T014)
- All four story test files (T013, T022, T028, T034) and e2e specs (T014, T023, T029, T035) touch different files and can be written in parallel up front, but each must still be run red before its own implementation
- Polish: T040 with T041

---

## Parallel Example: User Story 1

```bash
# Write the failing tests together:
Task: "Write failing tests in packages/core/tests/add.test.ts"
Task: "Write failing e2e scenarios in e2e/tests/add-and-list.spec.ts"

# Create independent UI components together:
Task: "Create apps/react/src/components/TodoItem.tsx"
Task: "Create apps/react/src/components/TodoForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup
2. Phase 2: Foundational
3. Phase 3: User Story 1
4. **Stop and validate**: add and list todos with unit and e2e tests green
5. Commit, then continue

### Incremental Delivery

1. Setup + Foundational: the empty app runs and the observable core exists
2. US1: add and see (MVP)
3. US2: validation
4. US3: toggle
5. US4: delete
6. Polish: guards, README, full quickstart run

Each story ends green on core unit tests and on the shared e2e suite, and does not break the previous stories.

---

## Notes

- [P] tasks touch different files and have no dependency on an unfinished task
- Never write implementation before its tests have been seen failing (constitution principle IV)
- Commit after each story, or after each red/green pair
- The e2e suite must only use the accessible names in contracts/ui-contract.md, so it can run unchanged against future apps
