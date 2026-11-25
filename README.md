# Basic Todo List

A todo list built to compare front-end frameworks. All business logic lives in one
framework-free library, `@todolist/core`; each app only renders it. One shared Playwright
suite checks every app against the same UI contract. State is in memory only.

## Layout

| Path | Role |
|---|---|
| `packages/core` | `TodoList` class: add, toggle, remove, validation, `subscribe()` / `getSnapshot()` |
| `apps/react` | React 19 + Vite app using the core through `useSyncExternalStore` |
| `apps/vue` | Vue 3 + Vite app using the core through a `useTodos` composable |
| `e2e` | Shared Playwright suite, run against any app |

## Commands

Requires Node.js 22.12+ or 24, and pnpm.

```bash
pnpm install
pnpm exec playwright install chromium   # first run only

pnpm test        # core unit tests
pnpm dev         # run the React app (port 5173)
pnpm dev:vue     # run the Vue app (port 5174)
pnpm e2e         # e2e tests (starts the React app itself)
pnpm e2e:vue     # the same e2e tests against the Vue app (starts and stops it)
pnpm typecheck   # type-check every package

E2E_BASE_URL=http://localhost:5173 pnpm e2e   # e2e against an already running app
```

See [specs/001-basic-todo-list/quickstart.md](specs/001-basic-todo-list/quickstart.md) for the
full validation guide.

## Adding a framework

1. Create `apps/<framework>` and add `@todolist/core` as a `workspace:*` dependency.
2. Use only the public API of the core ([contracts/core-api.md](specs/001-basic-todo-list/contracts/core-api.md));
   keep no business logic in the app.
3. Expose exactly the accessible UI described in
   [contracts/ui-contract.md](specs/001-basic-todo-list/contracts/ui-contract.md).
4. Give the app its own port, then start it and run the shared suite against it:
   `E2E_BASE_URL=<app url> pnpm e2e`. `apps/vue` is a worked example, with its script
   [`scripts/e2e-vue.sh`](scripts/e2e-vue.sh) to copy.
