---

description: "Task list for the second todo list app (Vue)"
---

# Tasks: Second Todo List App (Vue)

**Input**: Design documents from `/specs/002-vue-todo-app/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md. Behavior and contracts are reused from feature 001 (`specs/001-basic-todo-list/`: spec.md, data-model.md, contracts/core-api.md, contracts/ui-contract.md) and are not copied.

**Tests**: REQUIRED by constitution principle IV, but no new test is written: the shared e2e suite in `e2e/` is the test, and it already exists. The red step is to run it against the Vue app before the UI exists and see it fail (plan.md, Constitution Check; research.md R3).

**Organization**: One user story (US1). No task touches `apps/react`, `packages/core`, `e2e/` or `e2e/playwright.config.ts` (spec FR-003, FR-004).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: User story the task belongs to (US1)

## Path Conventions

- Vue app: `apps/vue/src/`
- Root script: `scripts/e2e-vue.sh`, root `package.json`
- Shared e2e suite (read-only here): `e2e/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the `apps/vue` workspace member and the script that runs the shared suite against it

- [ ] T001 Scaffold `apps/vue`: `package.json` (name `@todolist/vue`, scripts `dev`, `build`, `preview`, `typecheck` using `vue-tsc --noEmit`; dependencies `vue` and `@todolist/core` as `workspace:*`; dev dependencies `@vitejs/plugin-vue`, `vite`, `vue-tsc`, `typescript`, as in research.md R2), `index.html` (same as `apps/react/index.html`, script `/src/main.ts`), `vite.config.ts` (Vue plugin, `server: { port: 5174, strictPort: true }`), `tsconfig.json` (extends `../../tsconfig.base.json`, DOM libs, `types: ["vite/client"]`, includes `src/**/*.vue`), and a minimal `src/main.ts`
- [ ] T002 [P] Create `scripts/e2e-vue.sh` per research.md R4: start `pnpm --filter @todolist/vue dev` in the background, wait until `http://localhost:5174` answers, run `pnpm --filter @todolist/e2e test` with `E2E_BASE_URL=http://localhost:5174`, stop the server on exit, failure or Ctrl-C (`trap`), and exit with the suite's exit code; make it executable
- [ ] T003 Add the root script `"e2e:vue": "./scripts/e2e-vue.sh"` to `package.json` (depends on T002)
- [ ] T004 Run `pnpm install`, then `pnpm -r typecheck`. If `vue-tsc` does not support TypeScript 7, downgrade TypeScript to 5.x in `apps/vue/package.json` only and record it in `specs/002-vue-todo-app/research.md` (R2)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The Vue plumbing every component depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [P] Create `apps/vue/src/todo-store.ts`: the single `TodoList` instance (exported as `todoList`) and the `useTodos()` composable per research.md R1 (`shallowRef` of `getSnapshot()`, `subscribe` when the component mounts, unsubscribe when it unmounts); no todo rule is defined here
- [ ] T006 [P] Create the app shell `apps/vue/src/App.vue` (`main` with the heading `Todo list` only) and mount it from `apps/vue/src/main.ts`; confirm `pnpm --filter @todolist/vue dev` serves the page at `http://localhost:5174`

**Checkpoint**: Foundation ready, the user story can begin

---

## Phase 3: User Story 1 - Same todo list in a second app (Priority: P1) 🎯 MVP

**Goal**: The Vue app behaves as the React app: the four user stories of feature 001 hold, and the shared e2e suite passes unchanged.

**Independent Test**: `pnpm e2e:vue` passes with every scenario green, and the manual check of `quickstart.md` holds (spec User Story 1).

### Red step ⚠️

> **Run the shared suite and see it FAIL before writing any component**

- [ ] T007 [US1] Run `pnpm e2e:vue` and confirm the scenarios fail (the page only has a heading). This also checks that `scripts/e2e-vue.sh` starts the app, runs the suite and stops the server

### Implementation for User Story 1

Markup follows `specs/001-basic-todo-list/contracts/ui-contract.md`; `apps/react/src/components/` is the model to mirror (read only, do not import from it).

- [ ] T008 [P] [US1] Create `apps/vue/src/components/TodoItem.vue`: a list item with a checkbox named by the todo title that calls `todoList.toggle`, a `Delete <title>` button that calls `todoList.remove`, and a `done` class when the todo is done
- [ ] T009 [US1] Create `apps/vue/src/components/TodoListView.vue`: the `Todos` list built from `useTodos()` with one `TodoItem` per todo, and the `No todos yet` status instead of the list when it is empty (depends on T005, T008)
- [ ] T010 [P] [US1] Create `apps/vue/src/components/TodoForm.vue`: the `New todo title` input and the `Add` button in a form; on submit it calls `todoList.add`, clears the input on success, and on `EMPTY_TITLE` keeps the input and shows the `A title is required` alert until the next successful add (depends on T005)
- [ ] T011 [P] [US1] Create `apps/vue/src/index.css` with the style for done todos (same look as `apps/react/src/index.css`) and import it from `apps/vue/src/main.ts`
- [ ] T012 [US1] Compose `TodoForm` and `TodoListView` in `apps/vue/src/App.vue` (depends on T009, T010)
- [ ] T013 [US1] Run `pnpm e2e:vue`; every scenario passes with no change to `e2e/`. Then run `pnpm e2e` (React app), `pnpm test` and `pnpm typecheck`; all pass

**Checkpoint**: The Vue app is fully functional and testable on its own

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Document the second app and prove nothing else changed

- [ ] T014 [P] Update the root `README.md`: add `apps/vue` to the layout table, `pnpm e2e:vue` to the commands, and point the "Adding a framework" steps at it as the second example
- [ ] T015 Run the validation of `specs/002-vue-todo-app/quickstart.md`, including `git diff --stat main -- apps/react packages/core e2e` (it must list no file) and the manual check in the browser

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependency
- **Foundational (Phase 2)**: depends on Setup (T001, T004)
- **User Story 1 (Phase 3)**: depends on Foundational and on T003 (the script used by T007 and T013)
- **Polish (Phase 4)**: depends on User Story 1

### Within User Story 1

- Red step (T007) before any component
- `TodoItem` (T008) before `TodoListView` (T009); `TodoForm` (T010) and the style (T011) are independent
- `App.vue` composition (T012) after T009 and T010; green run (T013) last

### Parallel Opportunities

- Setup: T002 with T001
- Foundational: T005 with T006
- User Story 1: T008, T010 and T011 together
- Polish: T014 (README) can be written while T015 runs the checks

---

## Parallel Example: User Story 1

```bash
# After the red step, create the independent components together:
Task: "Create apps/vue/src/components/TodoItem.vue"
Task: "Create apps/vue/src/components/TodoForm.vue"
Task: "Create apps/vue/src/index.css and import it from main.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 is the whole feature)

1. Phase 1: Setup
2. Phase 2: Foundational
3. Phase 3: red run, components, green run
4. **Stop and validate**: `pnpm e2e:vue` and `pnpm e2e` both green
5. Phase 4: README and quickstart
6. Commit, one commit per package (`feat(vue)` for the app, `chore(e2e)` for the script, `docs` for the README)

---

## Notes

- Never write a component before the red run of T007 (constitution principle IV)
- Do not edit `apps/react`, `packages/core`, `e2e/` or `playwright.config.ts`; if the suite needs a change, it is a change to feature 001's contract and applies to both apps
- The Vue app has no business logic: if a rule seems missing, it belongs in `packages/core`
