#!/usr/bin/env bash
# Runs the shared e2e suite against the Vue app: starts the app, waits for it,
# runs the suite with E2E_BASE_URL, and always stops the app afterwards.
set -euo pipefail

cd "$(dirname "$0")/.."

PORT=5174
URL="http://localhost:${PORT}"

pnpm --filter @todolist/vue dev >/dev/null 2>&1 &
SERVER_PID=$!

cleanup() {
  # Vite runs as a child of pnpm: stop the whole group of processes.
  pkill -P "$SERVER_PID" 2>/dev/null || true
  kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

for _ in $(seq 1 60); do
  if curl -s -o /dev/null "$URL"; then break; fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "e2e:vue: the Vue app stopped before answering on ${URL} (is port ${PORT} already in use?)" >&2
    exit 1
  fi
  sleep 0.5
done

if ! curl -s -o /dev/null "$URL"; then
  echo "e2e:vue: the Vue app did not answer on ${URL} in time" >&2
  exit 1
fi

E2E_BASE_URL="$URL" pnpm --filter @todolist/e2e test
