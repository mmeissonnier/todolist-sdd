# Quickstart: Basic Todo List

Validation guide for this feature. Prerequisites: Node.js 22.12+ or 24, pnpm.

## Setup

```bash
pnpm install
pnpm exec playwright install chromium   # first run only
```

## 1. Core unit tests

```bash
pnpm --filter @todolist/core test
```

Expected: all tests pass. They cover add, trimming, rejection of empty and whitespace-only
titles, toggle, remove, duplicate titles, notification rules and snapshot stability. See
[contracts/core-api.md](./contracts/core-api.md).

## 2. Run the React app

```bash
pnpm --filter @todolist/react dev
```

Expected: the app opens at the printed local URL with an empty list and the message
`No todos yet`.

## 3. End-to-end tests

```bash
pnpm --filter @todolist/e2e test                          # starts the React app itself
E2E_BASE_URL=http://localhost:5173 pnpm --filter @todolist/e2e test   # against a running app
```

Expected: all scenarios of the four user stories pass. See
[contracts/ui-contract.md](./contracts/ui-contract.md).

## Manual check against the spec

1. Add "Buy milk": it appears, not done.
2. Submit an empty title, then spaces only: nothing is added and `A title is required` shows.
3. Mark "Buy milk" done, then not done again.
4. Delete it: `No todos yet` shows.
5. Reload the page: the list is empty.
