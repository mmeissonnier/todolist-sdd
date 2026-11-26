# Implementation Plan: Common Frontend Styles

**Branch**: `003-common-frontend-styles` | **Date**: 2026-11-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-common-frontend-styles/spec.md`

## Summary

Create one shared workspace package, `packages/design-tokens` (`@todolist/design-tokens`), that holds every visual rule: named design tokens (colors, fonts, sizes, radii), global rules, and one style file per component. Styling uses Tailwind CSS v4 with the DaisyUI plugin. Tokens are declared once as CSS variables (Tailwind `@theme` + one custom DaisyUI theme). Component styles are written with `@apply` of DaisyUI/Tailwind utilities on **semantic class names** (`todo-form`, `todo-item`, ...), so React and Vue markup carry the same few class names and no utility strings. Each app imports a single entry stylesheet and applies the class contract; behavior is untouched.

## Technical Context

**Language/Version**: TypeScript (existing apps) + CSS; Node as per existing workspace

**Primary Dependencies**: `tailwindcss` v4, `@tailwindcss/vite` v4, `daisyui` v5 (latest 4.x / 5.x, pinned at install). Tailwind and DaisyUI are build-time only.

**Storage**: N/A

**Testing**: Vitest in `packages/design-tokens` (token and style-rule checks, written first); existing Playwright e2e suite run against both apps (must stay green); manual side-by-side visual review (clarified in spec)

**Target Platform**: Evergreen desktop and mobile browsers

**Project Type**: pnpm monorepo, front-end only (shared package + `apps/react` + `apps/vue`)

**Performance Goals**: N/A (a few KB of CSS)

**Constraints**: No framework named in the spec; no business logic touched; apps must not import from one another; one place to change a token; light theme only

**Scale/Scope**: 2 apps, 5 styled elements (page, form, list, item, empty state); must accept a 3rd app and new components without edits to existing ones

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Note |
|-----------|--------|------|
| I. Framework-agnostic specs | PASS | Spec names no technology; Tailwind/DaisyUI appear only here and in research |
| II. Shared core | PASS | `packages/core` untouched; no logic duplicated |
| III. Monorepo layout | PASS | Shared code in `packages/design-tokens`; apps depend on it, not on each other |
| IV. TDD | PASS | Token/style tests in the package are written and seen failing first; e2e suite must stay green |
| V. Front-end only and simplicity | PASS with note | Two build-time dependencies added by explicit decision. No JS API, no runtime theming, no extra abstraction. Single package for tokens + components (no separate `ui` package) |

Post-design re-check: still PASS (see Complexity Tracking: none required).

## Project Structure

### Documentation (this feature)

```text
specs/003-common-frontend-styles/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── class-contract.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
packages/design-tokens/
├── package.json                 # @todolist/design-tokens, exports ./styles.css and ./tokens.css
├── src/
│   ├── tokens.css               # Tailwind @theme (fonts, sizes) + custom DaisyUI theme (colors, radii)
│   ├── base.css                 # global rules: reset additions, page typography, background, layout width
│   ├── components/
│   │   ├── todo-form.css
│   │   ├── todo-list.css
│   │   ├── todo-item.css
│   │   └── todo-empty.css
│   └── styles.css               # entry: tailwind + daisyui plugin + tokens + base + components
└── tests/
    ├── tokens.test.ts           # required tokens exist, defined once
    └── components.test.ts       # one file per component, no raw color/size literals, all in styles.css

apps/react/src/  (index.css reduced to one import; components get class names)
apps/vue/src/    (same)
apps/*/vite.config.ts            # add @tailwindcss/vite plugin
```

**Structure Decision**: One new package. Tokens, global rules and component styles live together because they are consumed together and a second package would add nothing. Layers stay separate by file, so each can be edited alone (FR-006).

## Complexity Tracking

No constitution violations to justify.
