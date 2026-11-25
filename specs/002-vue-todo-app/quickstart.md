# Quickstart: Second Todo List App (Vue)

Validation guide for this feature. Prerequisites: Node.js 22.12+ or 24, pnpm. Setup is the
same as [feature 001](../001-basic-todo-list/quickstart.md).

## Setup

```bash
pnpm install
pnpm exec playwright install chromium   # first run only
```

## 1. Run the Vue app

```bash
pnpm dev:vue
```

Expected: the app opens at `http://localhost:5174` with an empty list and the message
`No todos yet`. The React app can run at the same time on port 5173.

## 2. Shared end-to-end suite against the Vue app

```bash
pnpm e2e:vue
```

Expected: the Vue app is started and stopped by the script, and all scenarios pass, with no
change to the suite. See [001 ui-contract.md](../001-basic-todo-list/contracts/ui-contract.md).

## 3. Nothing else changed

```bash
pnpm test        # core unit tests
pnpm e2e         # same suite against the React app
pnpm typecheck   # every package, including apps/vue
git diff --stat main -- apps/react packages/core e2e
```

Expected: tests pass, and the last command lists no file.

## Manual check against the spec

Follow the manual check of [001 quickstart.md](../001-basic-todo-list/quickstart.md) in the
Vue app: add, reject an empty and a spaces-only title, mark done and not done, delete, reload
and find an empty list.
