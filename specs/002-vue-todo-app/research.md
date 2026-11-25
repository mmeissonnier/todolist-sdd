# Research: Second Todo List App (Vue)

Choices already made in [feature 001's research](../001-basic-todo-list/research.md) (R1 to
R7: observable core, snapshot stability, add result, ids, core as TypeScript source, shared
e2e suite, tooling) apply unchanged. Only what is new for Vue is decided here. Versions were
checked against the npm registry on 2026-11-25.

## R1. Reading the core from Vue

- **Decision**: `apps/vue/src/todo-store.ts` creates the single `TodoList` and exports a
  `useTodos()` composable. It holds the snapshot in a `shallowRef`, subscribes to the core
  when the component mounts, replaces the ref value with `getSnapshot()` on each notification,
  and unsubscribes when the component unmounts.
- **Rationale**: It is the Vue equivalent of `useSyncExternalStore` in `apps/react`. The core
  returns a new immutable array on each change (001 R2), so a `shallowRef` is enough, and
  Vue's deep reactivity would only add cost. All logic stays in the core (principle II).
- **Alternatives considered**: Pinia or a `reactive()` copy of the list (a second source of
  truth that could drift from the core, and an extra dependency); calling `list()` in
  templates with no subscription (no re-render).

## R2. Vue and build tooling

- **Decision**: Vue 3.5.46, `@vitejs/plugin-vue` 6.0.11 (supports Vite 8), `vue-tsc` 3.3.14
  for `.vue` type-checking (its peer is `typescript >= 5`). Single-file components with
  `<script setup lang="ts">`. Vite 8 and TypeScript 7 as in `apps/react`.
- **Rationale**: Latest stable releases, the same toolchain as the React app. `tsc` cannot
  read `.vue` files, so `typecheck` uses `vue-tsc`.
- **Alternatives considered**: Options API (more verbose, no benefit); skipping type-check of
  `.vue` files (leaves the app unchecked). If `vue-tsc` fails on TypeScript 7, downgrade
  TypeScript to 5.x for this package only and record it here, as 001 R7 allows.
- **Outcome (2026-11-25)**: `vue-tsc` 3.3.14 does not work with TypeScript 7 (its Volar
  dependencies require `typescript <7`; `vue-tsc --noEmit` fails with
  `ERR_PACKAGE_PATH_NOT_EXPORTED ./lib/tsc`). `apps/vue` therefore uses TypeScript 6.0.3, the
  latest release below 7. The other packages stay on TypeScript 7.

## R3. No unit tests in `apps/vue`

- **Decision**: No Vitest in `apps/vue`. The shared e2e suite is the only test.
- **Rationale**: The app has no logic: the core's rules are covered by the core's unit tests,
  and the rendering is covered by the e2e suite (principle IV, and 001 R6). A component test
  would repeat the e2e checks.
- **Alternatives considered**: Component tests with Vue Test Utils (duplicate the e2e suite
  with a second, framework-specific harness).

## R4. Running the shared suite against the Vue app

- **Decision**: A root script `"e2e:vue": "./scripts/e2e-vue.sh"`. The shell script starts
  `pnpm --filter @todolist/vue dev` in the background (port 5174, `strictPort`), waits until
  `http://localhost:5174` answers, runs `pnpm --filter @todolist/e2e test` with
  `E2E_BASE_URL=http://localhost:5174`, then stops the server (also on failure or Ctrl-C,
  with a `trap`) and exits with the suite's exit code.
- **Rationale**: `playwright.config.ts` already skips its own server when `E2E_BASE_URL` is
  set (001 R6), so the config stays unchanged, as required. A short script needs no new
  dependency (principle V). A fixed, different port lets both apps run at once.
- **Alternatives considered**: `start-server-and-test` (an extra dependency for 15 lines of
  shell); a second Playwright project or a config switch (changes `playwright.config.ts`);
  starting the server by hand (easy to forget, not repeatable in CI).

## R5. Equivalence with the React app

- **Decision**: Same markup contract as `apps/react`: a `form` with a labelled input and an
  `Add` button, an `alert` paragraph, a `ul` labelled `Todos`, a `status` paragraph for the
  empty state, and per item a `label` wrapping a checkbox and the title, plus a
  `Delete <title>` button. Same `done` style in `index.css`.
- **Rationale**: These are the accessible names of
  [001's UI contract](../001-basic-todo-list/contracts/ui-contract.md); the e2e suite finds
  elements only through them.
- **Alternatives considered**: None; the contract fixes this.
