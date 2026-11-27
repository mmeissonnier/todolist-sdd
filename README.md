# Basic Todo List

A todo list built to compare front-end frameworks, developed with **Spec-Driven Development (SDD)**
using [GitHub Spec Kit](https://github.com/github/spec-kit). Adding a new framework is a short,
repeatable workflow: write a spec, plan, generate tasks, implement.

This project was built with **Claude Code**, using **Haiku** and **Sonnet** (one model per Spec Kit
skill). To use another coding agent or other models, see
[Switching harness and model](#switching-harness-and-model).

Three things make that cheap:

- **One framework-free core**, `@todolist/core`, holds all business logic. Each app only renders it.
- **One shared design system**, `@todolist/design-tokens` (Tailwind v4 + DaisyUI), so every app looks the same.
- **One shared Playwright suite** checks every app against the same UI contract. State is in memory only.

## How it was built (SDD)

Each feature lives in `specs/<NNN>-<name>/` and went through the Spec Kit steps:

| Step | Skill | Output |
|---|---|---|
| Specify | `/speckit-specify` | `spec.md`: what and why |
| Clarify | `/speckit-clarify` | answers encoded back into the spec |
| Plan | `/speckit-plan` | `plan.md`, `research.md`, `contracts/` |
| Tasks | `/speckit-tasks` | `tasks.md`: ordered tasks |
| Implement | `/speckit-implement` | the code |

| Feature | What it added |
|---|---|
| [001-basic-todo-list](specs/001-basic-todo-list) | core library, React app, e2e suite |
| [002-vue-todo-app](specs/002-vue-todo-app) | Vue app, validated by the same e2e suite |
| [003-common-frontend-styles](specs/003-common-frontend-styles) | shared design system for all apps |


## Layout

| Path | Role |
|---|---|
| `packages/core` | `TodoList` class: add, toggle, remove, validation, `subscribe()` / `getSnapshot()` |
| `apps/react` | React 19 + Vite app using the core through `useSyncExternalStore` |
| `apps/vue` | Vue 3 + Vite app using the core through a `useTodos` composable |
| `packages/design-tokens` | Shared styles (Tailwind v4 + DaisyUI): tokens, global rules, one file per component. See its [README](packages/design-tokens/README.md) |
| `e2e` | Shared Playwright suite, run against any app |

## Commands

Requires Node.js 22.12+ or 24, and pnpm.

```bash
pnpm install
pnpm exec playwright install chromium   # first run only

pnpm test        # core unit tests
pnpm test:styles # design-tokens checks (tokens, components, app wiring)
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

The recommended way is to run it through Spec Kit, like `apps/vue` was:

1. `/speckit-specify`: describe the new app, e.g. "A Svelte todo app with the same behaviour as the React one."
2. `/speckit-plan`: state the stack (framework, port). The plan reuses `@todolist/core`,
   the UI contract and `@todolist/design-tokens`.
3. `/speckit-tasks`, then `/speckit-implement`.

The result must satisfy these rules, which the spec and plan encode:

1. Create `apps/<framework>` and add `@todolist/core` as a `workspace:*` dependency.
2. Use only the public API of the core ([contracts/core-api.md](specs/001-basic-todo-list/contracts/core-api.md));
   keep no business logic in the app.
3. Expose exactly the accessible UI described in
   [contracts/ui-contract.md](specs/001-basic-todo-list/contracts/ui-contract.md).
4. Give the app its own port, then start it and run the shared suite against it:
   `E2E_BASE_URL=<app url> pnpm e2e`. `apps/vue` is a worked example, with its script
   [`scripts/e2e-vue.sh`](scripts/e2e-vue.sh) to copy.
5. Adopt the shared styles in three steps, described in the
   [design-tokens README](packages/design-tokens/README.md#adopt-in-a-new-app).

The e2e suite is the acceptance test: a framework is done when the shared suite passes against it.

## Example: adding Svelte

Same steps as above, with Svelte specifics. `apps/vue` is the template to copy.

1. **Scaffold** `apps/svelte` (package `@todolist/svelte`) with Svelte 5 + Vite
   (`@sveltejs/vite-plugin-svelte`). Add `@todolist/core`, `@todolist/design-tokens`
   (both `workspace:*`), `tailwindcss`, `@tailwindcss/vite` and `daisyui`.
2. **Port**: set `server: { port: 5175, strictPort: true }` in `vite.config.ts`
   (React uses 5173, Vue 5174). Add the `tailwindcss()` Vite plugin.
3. **Core binding**: wrap `subscribe()` / `getSnapshot()` of the core in a Svelte store
   (`readable`) or a rune-based module, like `apps/vue/src/todo-store.ts`. No business logic.
4. **Styles**: a single stylesheet `src/index.css` containing only
   `@import "@todolist/design-tokens/styles.css";`, then use the class names of the design system.
5. **UI**: follow the [UI contract](specs/001-basic-todo-list/contracts/ui-contract.md).
6. **Scripts**: add `dev:svelte` and `e2e:svelte` to the root `package.json`;
   copy `scripts/e2e-vue.sh` to `scripts/e2e-svelte.sh` and change the filter and port.
7. **Style check**: `packages/design-tokens/tests/apps.test.ts` scans `apps/*` but only
   `.vue`, `.tsx` and `.ts` files for inline styles. Add `svelte` to its regex
   (`/\.(vue|svelte|tsx|ts)$/`), otherwise `<style>` blocks in `.svelte` files go unchecked.
8. **Validate**: `pnpm typecheck`, `pnpm test:styles`, `pnpm e2e:svelte`.

Through Spec Kit, `/speckit-specify` can take this whole list as its description.

## Switching harness and model

The Spec Kit workflow is not tied to Claude Code. Two separate things can change.

### Change the harness (the coding agent)

Spec Kit generates its commands for one agent at a time, through an "integration". This repo uses
`claude` (see `.specify/integration.json`).

1. Check the available integrations: `uvx --from git+https://github.com/github/spec-kit.git specify init --help`
   (examples listed there include `claude`, `codex`, `gemini`, `vibe`, `codebuddy`, and `generic` for any other agent).
2. Re-run the init in place with the new integration, which keeps `specs/` and the code:

   ```bash
   uvx --from git+https://github.com/github/spec-kit.git specify init \
     --here --force --integration <name> --non-interactive
   ```

   `--force` overwrites `.specify/memory/` (the constitution): back it up first, or copy the
   approach of [`scripts/speckit-update.sh`](scripts/speckit-update.sh), which restores it.
3. Review `git diff`: the agent's command or skill files (e.g. `.claude/skills/`) are replaced
   by the new agent's files (e.g. `.codex/...`).
4. Update the scripts that hardcode `claude`: `--integration claude` in
   `scripts/speckit-update.sh`.

`specs/`, `.specify/memory/constitution.md` and the code are agent-independent, so work started
with one agent can be continued with another.

### Change the model

Per-skill models are set by [`scripts/speckit-models.sh`](scripts/speckit-models.sh), which adds a
`model:` line to each `.claude/skills/speckit-*/SKILL.md`.

1. Edit the `MODELS` list in the script (`"specify:sonnet"`, `"tasks:haiku"`, ...).
2. Run `pnpm speckit:models`. It is idempotent.
3. Skills not listed keep the model of the current session (`/model` in Claude Code).

`pnpm speckit:update` regenerates the skill files, then runs the script again, so your choices
survive an upgrade. This model mechanism is specific to Claude Code skills: with another harness,
set the model in that tool's own settings.
