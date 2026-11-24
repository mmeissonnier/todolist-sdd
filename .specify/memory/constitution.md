# TodoList Constitution

## Core Principles

### I. Framework-Agnostic Specifications

`spec.md` MUST describe observable behavior only. It MUST NOT mention any framework, library,
or tool (React, Vue, Angular, Svelte, Solid, etc.). Technology choices belong in `plan.md`.

Rationale: one spec is reused by every framework implementation. Naming a framework in the
spec would make it unusable for the others.

### II. Shared Core

All business logic (Todo model, rules, storage) MUST live in `packages/core` as pure
TypeScript. `packages/core` MUST NOT depend on any UI framework. Every app MUST reuse it and
MUST NOT reimplement business logic.

Rationale: behavior stays identical across implementations, and each app is reduced to a UI
layer.

### III. Monorepo Layout

The repository MUST be a pnpm workspace. Each framework implementation MUST live in its own
`apps/<framework>` directory. Shared code MUST live in `packages/*`. Apps MUST NOT import from
one another.

Rationale: a predictable layout lets a new framework be added without touching the others.

### IV. Test-Driven Development (NON-NEGOTIABLE)

Red-Green-Refactor MUST be followed strictly: tests MUST be written first and MUST be
observed failing before any implementation code is written. Unit tests for `packages/core`
MUST use Vitest. A single Playwright end-to-end suite MUST run against every app, since all
apps share the same behavior.

Rationale: the shared e2e suite proves that every implementation matches the same spec.

### V. Front-End Only and Simplicity

The project MUST have no backend. Persistence MUST use `localStorage`. Features and
abstractions not required by a current spec MUST NOT be added (YAGNI).

Rationale: the project is deliberately small so that the comparison between frameworks stays
the focus.

## Technical Constraints

- Language: TypeScript for all code, including `packages/core`.
- Package manager: pnpm (workspaces).
- Unit tests: Vitest. End-to-end tests: Playwright.
- First implementation: React in `apps/react`. Vue, Angular, Svelte and Solid MAY follow in
  `apps/<framework>`.
- All Spec Kit documents (constitution, specs, plans, tasks) MUST be written in English.

## Development Workflow

- Work follows the Spec Kit cycle: specify, plan, tasks, implement.
- Each feature MUST have a spec before any plan, and a plan before any task list.
- Each plan MUST include a Constitution Check and MUST NOT proceed while a violation is
  unjustified.
- Each task list MUST place test tasks before the implementation tasks they cover.
- A new framework implementation MUST reuse the existing `spec.md` and produce its own plan.

## Governance

This constitution supersedes all other practices. Amendments MUST be made by editing this
file, with the version bumped according to semantic versioning:

- MAJOR: a principle is removed or redefined in a backward-incompatible way.
- MINOR: a principle or section is added, or guidance is materially expanded.
- PATCH: wording clarifications and typo fixes.

Every plan and review MUST verify compliance with these principles. Any deviation MUST be
justified in writing in the plan's Complexity Tracking section.

**Version**: 1.0.0 | **Ratified**: 2026-11-24 | **Last Amended**: 2026-11-24
