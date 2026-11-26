# @todolist/design-tokens

Shared styles for every front-end app: design tokens, global rules and one style file per component. Built with Tailwind CSS v4 and DaisyUI v5 at build time only.

## Layout

```text
src/tokens.css            design values (the only place values are defined)
src/base.css              global rules (page, typography, layout column)
src/components/*.css      one file per component, semantic class names
src/styles.css            entry point: Tailwind, DaisyUI, tokens, base, components
tests/                    token, component and app-wiring checks (Vitest)
```

The class names apps must use are listed in `specs/003-common-frontend-styles/contracts/class-contract.md`.

## Add or change a design value

Edit one line in `src/tokens.css`. Colors and radii go in the DaisyUI theme block, fonts and sizes in the `@theme` block. Every app picks it up. Record the contrast ratio of any new color pair in the comment at the top of the file (WCAG AA: 4.5:1 for text).

## Add a component style

1. Create `src/components/<prefix>-<name>.css` using the token-based utilities (`@apply`) or `var(--token)`. No raw colors, no raw lengths (the tests enforce it).
2. Add one `@import "./components/<file>.css";` line to `src/styles.css`.
3. Add the class names to `contracts/class-contract.md` and a matching entry in `tests/components.test.ts`.
4. Apply the class names in each app. Existing component files do not change.

Note: `@apply` of some DaisyUI components drops pseudo-element rules (the checkbox mark). If a component looks wrong, use plain Tailwind utilities or `var(--token)` for that element.

## Adopt in a new app

1. Add dependencies `@todolist/design-tokens` (`workspace:*`), `tailwindcss`, `@tailwindcss/vite` and `daisyui`, and add the `@tailwindcss/vite` plugin in the app's Vite config.
2. Put `@import "@todolist/design-tokens/styles.css";` in the app's only stylesheet.
3. Apply the class names from the class contract.

Apps carry no visual rules of their own (`tests/apps.test.ts` checks it).

## Tests

```bash
pnpm test:styles
```
