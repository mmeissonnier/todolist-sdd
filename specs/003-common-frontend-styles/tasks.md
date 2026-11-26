---

description: "Task list for common frontend styles (design-tokens package, Tailwind v4 + DaisyUI)"
---

# Tasks: Common Frontend Styles

**Input**: Design documents from `/specs/003-common-frontend-styles/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/class-contract.md, quickstart.md

**Tests**: REQUIRED by constitution principle IV. Style tests in `packages/design-tokens/tests/` are written first and MUST be seen failing before the CSS they check exists. The shared e2e suite in `e2e/` already exists and MUST stay green for both apps; it is not modified. Visual identity is checked by manual review (spec clarification), not by screenshots.

**Organization**: Tasks are grouped by user story. No task touches `packages/core` or `e2e/`. Apps never import from each other.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: User story the task belongs to (US1, US2, US3)

## Path Conventions

- Shared package: `packages/design-tokens/` (`src/`, `src/components/`, `tests/`)
- Apps: `apps/react/`, `apps/vue/`
- Root: `package.json`, `README.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the `packages/design-tokens` workspace member and install the styling dependencies

- [X] T001 Scaffold `packages/design-tokens`: `package.json` (name `@todolist/design-tokens`, `private`, `type: module`, `exports` for `./styles.css` -> `./src/styles.css` and `./tokens.css` -> `./src/tokens.css`, script `test` = `vitest run`, script `typecheck` = `tsc --noEmit`; dev dependencies `vitest`, `typescript`, `@types/node` at the same versions as `packages/core/package.json`; dependencies `tailwindcss` v4 and `daisyui` v5), and `tsconfig.json` extending `../../tsconfig.base.json` with `types: ["node"]` and `include: ["tests"]`
- [X] T002 Add `tailwindcss` (v4) and `@tailwindcss/vite` (v4) as dependencies of `apps/react/package.json` and `apps/vue/package.json`, then run `pnpm install` at the repo root. Also add `daisyui` (v5) to both apps' `package.json`: under pnpm's strict layout the shared CSS is compiled from the app's build, so `@plugin "daisyui"` must resolve from the app. The package keeps its own `tailwindcss` and `daisyui` entries for its tests; use the same version range in all three `package.json` files (depends on T001)
- [X] T003 [P] Add the root script `"test:styles": "pnpm --filter @todolist/design-tokens test"` to `package.json`, next to `test`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Design tokens and global rules, shared by every user story. Test first (red), then CSS (green).

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Write `packages/design-tokens/tests/tokens.test.ts`: read `src/tokens.css` as text and assert it exists, declares one custom DaisyUI theme set as default and light, and defines each token from data-model.md (colors `base-100`, `base-200`, `base-300`, `base-content`, `primary`, `primary-content`, `error`, `success`; `--font-sans`; `--text-sm`, `--text-base`, `--text-lg`, `--text-2xl`; `--container-app`; `--radius-field`, `--radius-box`), each exactly once; also assert `src/base.css` exists and contains no hex, `rgb(`, `hsl(` or `oklch(` literal. Run `pnpm test:styles` and confirm it FAILS (red)
- [X] T005 Create `packages/design-tokens/src/tokens.css`: Tailwind `@theme` block (font family, text sizes, `--container-app`) and one `@plugin "daisyui/theme"` block (`name`, `default: true`, `color-scheme: light`, the color roles and radii above) with a neutral minimal palette and one accent color. Choose colors so each text/background pair meets WCAG AA (4.5:1) and record each checked pair with its measured ratio in a short comment block at the top of the file. Pairs to check (all >= 4.5:1): `base-content` on `base-100`, `base-200` and `base-300`; `primary-content` on `primary`; `primary` on `base-100` (links, focus ring, >= 3:1 for non-text); `error` on `base-100`; `success` on `base-100`; the muted text of a completed todo on `base-100`; the input placeholder on `base-100`. Compute ratios with a contrast checker (for example the WebAIM contrast checker); disabled controls are exempt from WCAG contrast
- [X] T006 Create `packages/design-tokens/src/base.css`: global rules using tokens only (`@apply`/`var()`): body background and text color, base font family and size, `.app` centered column limited by `--container-app` with small-screen padding, `.app-title` heading style, `prefers-reduced-motion` rule disabling transitions (depends on T005)
- [X] T007 Create `packages/design-tokens/src/styles.css` as the single entry: `@import "tailwindcss";`, `@plugin "daisyui";`, then imports of `./tokens.css` and `./base.css` (component imports are added in Phase 3). Run `pnpm test:styles` and confirm `tokens.test.ts` is GREEN (depends on T005, T006)

**Checkpoint**: Tokens and global rules exist and are tested; user stories can start

---

## Phase 3: User Story 1 - Identical look across every app (Priority: P1) MVP

**Goal**: Both apps display the same neutral minimal design, built only from the shared package.

**Independent Test**: Run `pnpm dev` and `pnpm dev:vue`, compare both pages side by side in every state (quickstart step 5): no visible difference. `pnpm e2e` and `pnpm e2e:vue` pass.

### Tests for User Story 1 (write first, must FAIL)

- [X] T008 [US1] Write `packages/design-tokens/tests/components.test.ts`: for each of `todo-form`, `todo-list`, `todo-item`, `todo-empty` assert that `src/components/<name>.css` exists, that `src/styles.css` imports it, that the file contains no hex, `rgb(`, `hsl(`, `oklch(` literal and no raw `px`/`rem`/`em` length other than `0` (lengths must come from tokens, Tailwind utilities or `var(--…)`; the only allowed exceptions are `1px` for border widths and focus outline offsets, listed in an `ALLOWED_LENGTHS` constant at the top of the test), and that it defines the class names listed for that unit in `contracts/class-contract.md`. Run `pnpm test:styles` and confirm it FAILS (red)

### Implementation for User Story 1

- [X] T009 [P] [US1] Create `packages/design-tokens/src/components/todo-form.css`: `.todo-form`, `.todo-form-input`, `.todo-form-submit`, `.todo-form-error` via `@apply` of DaisyUI/Tailwind utilities (`input`, `btn btn-primary`, `text-error`, layout gap); hover, focus-visible and disabled states
- [X] T010 [P] [US1] Create `packages/design-tokens/src/components/todo-list.css`: `.todo-list` (no bullets, vertical spacing, bordered container using tokens)
- [X] T011 [P] [US1] Create `packages/design-tokens/src/components/todo-item.css`: `.todo`, `.todo-check`, `.todo-title`, `.todo-delete`; `.todo.done .todo-title` struck through and muted; wrapping of long titles; hover and focus-visible states; long titles wrap (`break-words`)
- [X] T012 [P] [US1] Create `packages/design-tokens/src/components/todo-empty.css`: `.todo-empty` muted centered message
- [X] T013 [US1] Import the four component files in `packages/design-tokens/src/styles.css` after `base.css`, then run `pnpm test:styles` and confirm `components.test.ts` is GREEN (depends on T008 to T012)
- [X] T014 [P] [US1] Wire `apps/react`: add `@todolist/design-tokens` as `workspace:*` dependency in `apps/react/package.json`, add the `@tailwindcss/vite` plugin in `apps/react/vite.config.ts`, replace the content of `apps/react/src/index.css` with `@import "@todolist/design-tokens/styles.css";` only (the old `.todo.done` rule is now in the shared package)
- [X] T015 [US1] Apply the class contract in `apps/react/src/App.tsx`, `apps/react/src/components/TodoForm.tsx`, `apps/react/src/components/TodoItem.tsx`, `apps/react/src/components/TodoListView.tsx` (class names only; keep the `todo` / `todo done` behavior, roles, labels and text unchanged) (depends on T014)
- [X] T016 [P] [US1] Wire `apps/vue`: same as T014 for `apps/vue/package.json`, `apps/vue/vite.config.ts` and `apps/vue/src/index.css`
- [X] T017 [US1] Apply the class contract in `apps/vue/src/App.vue`, `apps/vue/src/components/TodoForm.vue`, `apps/vue/src/components/TodoItem.vue`, `apps/vue/src/components/TodoListView.vue` (same names as T015, behavior unchanged) (depends on T016)
- [X] T018 [US1] Run `pnpm install`, then build both apps (`pnpm --filter @todolist/react build`, `pnpm --filter @todolist/vue build`) and confirm each build resolves `@plugin "daisyui"` with no error (A2 check) and that each emitted CSS contains the rules for `.todo-form-submit` and `.todo`. If `@apply` of DaisyUI classes does not resolve, switch the affected component files to the fallback in research.md section 4 (Tailwind utilities and `var(--color-*)` tokens) and rerun `pnpm test:styles` (depends on T013, T015, T017)
- [X] T019 [US1] Run `pnpm e2e` and `pnpm e2e:vue`; all existing tests MUST pass (FR-011, SC-007)
- [ ] T020 [US1] Manual side-by-side review of React (5173) and Vue (5174) per quickstart step 5: empty, with items, one completed, invalid submit, keyboard focus, hover and disabled states, a very long todo title (wraps, no horizontal scroll), widths 320 px and 1920 px, and a page where the stylesheet is blocked (content stays readable and usable); fix any difference in the shared package only (SC-001, SC-006)

**Checkpoint**: US1 complete; the MVP is a shared, identical design in both apps

---

## Phase 4: User Story 2 - Change a style once, see it everywhere (Priority: P2)

**Goal**: A design value changes in one place and apps contain no visual rules of their own.

**Independent Test**: Edit `primary` in `tokens.css`; both apps show the new color with no other file edited (quickstart step 6).

### Tests for User Story 2 (write first, must FAIL where not yet true)

- [X] T021 [US2] Write `packages/design-tokens/tests/apps.test.ts`: for `apps/react/src/index.css` and `apps/vue/src/index.css` assert the only rule is the single `@import "@todolist/design-tokens/styles.css";` (no selectors, no declarations); and assert no other `.css` or `<style>` block exists under `apps/*/src`. Run `pnpm test:styles`; it should be GREEN after Phase 3, and MUST be shown failing once by temporarily adding a rule in one app's `index.css`, then reverting (FR-001)

### Implementation for User Story 2

- [X] T022 [US2] Perform quickstart step 6: change `primary` in `packages/design-tokens/src/tokens.css`, confirm both dev servers show the new color with no other edit, then revert (SC-002, FR-005)
- [X] T023 [US2] Check `packages/design-tokens/tests/components.test.ts` and `base.css` for any remaining hard-coded color or size; replace each with a token reference and add a token to `tokens.css` only when none fits (FR-004)

**Checkpoint**: US1 and US2 both hold; single edit point is proven and guarded by tests

---

## Phase 5: User Story 3 - Add a new styled component easily (Priority: P3)

**Goal**: A maintainer adds a component style, or a new app, by following a short written convention without touching existing files.

**Independent Test**: Quickstart step 7: add a throwaway component file plus one import line; no existing component file changes.

### Implementation for User Story 3

- [X] T024 [US3] Write `packages/design-tokens/README.md` (English): layout of the package, how to add a design value (one line in `tokens.css`), how to add a component style (new file in `src/components/` with its own class prefix, one import line in `styles.css`, update `contracts/class-contract.md`), the rule that apps carry no visual rules, and the one-step adoption for a new app (dependency, Tailwind Vite plugin, one `@import`) (FR-007, FR-012)
- [X] T025 [US3] Perform quickstart step 7: add a throwaway `src/components/todo-demo.css` and its import line, confirm `pnpm test:styles` and both builds pass and that no existing component file changed (`git diff --stat`), then revert (SC-003)
- [X] T026 [US3] Dry-run the adoption steps from the README on a scratch copy of `apps/vue` outside the workspace tracking (or by re-reading the Vue wiring in T016) and confirm it needs exactly the three documented actions; fix the README if not (SC-004)

**Checkpoint**: All three stories delivered

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T027 [P] Update root `README.md`: mention `packages/design-tokens`, `pnpm test:styles`, and link to the package README
- [X] T028 [P] Ensure `specs/003-common-frontend-styles/contracts/class-contract.md` matches the class names actually used in both apps (fix whichever is wrong)
- [X] T029 Run the full validation: `pnpm typecheck`, `pnpm test`, `pnpm test:styles`, `pnpm e2e`, `pnpm e2e:vue`, and quickstart steps 1 to 7; everything MUST pass
- [ ] T030 Re-check each pair listed in T005 against the final palette (including hover state colors of `btn-primary`), update the ratios recorded in `tokens.css`, and confirm keyboard focus is visible on input, add button, checkbox and delete button in both apps (FR-008, FR-009, SC-005)

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: T001 first; T002 depends on T001; T003 parallel
- **Foundational (Phase 2)**: T004 (red) -> T005 -> T006 -> T007 (green); blocks all stories
- **US1 (Phase 3)**: T008 (red) and T009 to T012 can run in parallel; T013 after them; React wiring (T014, T015) and Vue wiring (T016, T017) are independent of each other; T018 to T020 after both
- **US2 (Phase 4)**: depends on US1 (apps wired); T021 -> T022, T023
- **US3 (Phase 5)**: depends on Phase 2 and the US1 layout; T024 -> T025, T026
- **Polish (Phase 6)**: after all stories

### Parallel Opportunities

- T003 with T001/T002
- T009, T010, T011, T012 (four different files)
- T014 with T016 (different apps); T015 with T017
- T027 with T028

### Parallel Example: User Story 1

```text
Task: T009 todo-form.css   |  T010 todo-list.css  |  T011 todo-item.css  |  T012 todo-empty.css
Task: T014 wire apps/react |  T016 wire apps/vue
```

## Implementation Strategy

**MVP first**: Phases 1, 2 and 3 deliver both apps with the same design. Stop and validate (T019, T020) before US2 and US3.

**Incremental delivery**: US2 adds the guard tests and proof of the single edit point; US3 adds the written convention. Each is independently verifiable.

## Notes

- Do not write framework names in `spec.md`; Tailwind and DaisyUI belong to plan and tasks only
- Commit after each phase; never edit `e2e/` or `packages/core`
- No task introduces persisted data, so no `data-model.md` field citation is required
