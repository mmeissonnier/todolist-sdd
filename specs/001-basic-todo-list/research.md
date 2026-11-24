# Research: Basic Todo List

All technical unknowns were resolved from the plan input and the constitution. Versions were
checked against the npm registry on 2026-11-24.

## R1. Core as a class with an observable API

- **Decision**: `TodoList` class in `packages/core` with `add`, `toggle`, `remove`,
  `list`, plus `subscribe(listener)` and `getSnapshot()`.
- **Rationale**: One instance can be the global state of any app. Mutating a class does not by
  itself trigger a re-render, so the class notifies subscribers after each change.
  `subscribe`/`getSnapshot` is the exact shape React's `useSyncExternalStore` expects, and
  maps simply to Vue, Svelte, Solid and Angular.
- **Alternatives considered**: Pure functions returning a new list (clean, but the state would
  live in each framework and could drift between apps); a framework state library per app
  (breaks principle II).

## R2. Snapshot stability

- **Decision**: `getSnapshot()` returns the same array reference until the state changes, then
  a new immutable array. Todos are never mutated in place.
- **Rationale**: `useSyncExternalStore` re-renders when the snapshot reference changes and
  loops infinitely if `getSnapshot()` returns a new array on every call.
- **Alternatives considered**: Returning a copy per call (infinite render loop).

## R3. Validation outcome

- **Decision**: `add(title)` returns a result object, `{ ok: true, todo }` or
  `{ ok: false, error: "EMPTY_TITLE" }`, instead of throwing.
- **Rationale**: An empty title is an expected user input, not an exceptional case. A result
  value is simple to test and to display in any framework.
- **Alternatives considered**: Throwing an error (forces try/catch in every app).

## R4. Todo identity

- **Decision**: Identifiers come from an incrementing counter owned by the `TodoList`
  instance (`"1"`, `"2"`, ...).
- **Rationale**: Spec requires two todos with the same title to be distinct. A counter is
  deterministic, which makes unit tests simple. It does not need to survive reloads (no
  persistence yet).
- **Alternatives considered**: `crypto.randomUUID()` (non-deterministic in tests; unnecessary
  until persistence exists).

## R5. Sharing the core without a build step

- **Decision**: `packages/core` exposes its TypeScript source through the `exports` field of
  its `package.json`. `apps/react` imports `@todolist/core` as a workspace dependency, and Vite
  compiles it.
- **Rationale**: Fewer moving parts than a build and watch pipeline. Sufficient for a
  front-end-only monorepo where every consumer uses a bundler.
- **Alternatives considered**: Pre-built `dist/` for the core (extra build orchestration with no
  benefit here).

## R6. Shared end-to-end suite

- **Decision**: `e2e/` is its own workspace package. Its Playwright config reads
  `E2E_BASE_URL`. When it is unset, the config starts the React app and uses its URL. Tests
  locate elements by accessible role and label only, as defined in
  [contracts/ui-contract.md](./contracts/ui-contract.md).
- **Rationale**: Principle IV requires the same suite to run against every app. Selectors tied
  to a framework or to CSS classes would break that. Accessible roles are identical across
  frameworks.
- **Alternatives considered**: One e2e folder per app (duplicated tests that can drift apart).

## R7. Tooling versions

- **Decision**: React 19, Vite 8 with `@vitejs/plugin-react`, Vitest 5, Playwright 1.65,
  TypeScript 7, pnpm 12. Installed Node is 24.19, which satisfies Vite (`^20.19 || >=22.12`)
  and Vitest (`^22.12 || ^24`).
- **Rationale**: Latest stable releases on the registry on 2026-11-24.
- **Alternatives considered**: Pinning older majors (no reason to start on outdated versions).
