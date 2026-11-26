# Research: Common Frontend Styles

## 1. Tailwind CSS v4 integration

- **Decision**: Use `tailwindcss` v4 with the `@tailwindcss/vite` plugin in each app. No `tailwind.config.js`; configuration is CSS-first (`@import "tailwindcss"`, `@theme`, `@plugin`, `@source`).
- **Rationale**: v4 is configured in CSS, which fits a shared stylesheet package. Both apps already use Vite.
- **Alternatives**: PostCSS plugin (more setup, no gain with Vite); Tailwind v3 (JS config duplicated per app).

## 2. DaisyUI

- **Decision**: DaisyUI v5 loaded with `@plugin "daisyui"` and a single custom theme declared with `@plugin "daisyui/theme"`, set as default, light only.
- **Rationale**: DaisyUI gives ready component classes (`btn`, `input`, `checkbox`, `list`) driven by theme variables, so changing a token changes every component (FR-005). It stays a build-time dependency.
- **Alternatives**: Plain Tailwind utilities only (more hand-written component rules); hand-written CSS (no scalability gain).

## 3. Where tokens live

- **Decision**: `packages/design-tokens` with `tokens.css` as the only place for values: color roles (base, content, primary, error, success), font families, font sizes, spacing scale, radii. A minimal set only; new tokens added on demand.
- **Rationale**: One edit point (FR-005, SC-002). Package name matches the user's request.
- **Alternatives**: Tokens copied in each app (violates FR-001); JS/JSON tokens with a generator (extra tooling, YAGNI).

## 4. Component styles shared by both frameworks

- **Decision**: One CSS file per component using `@apply` of DaisyUI/Tailwind utilities on semantic class names. Apps carry only the class names defined in `contracts/class-contract.md`.
- **Rationale**: Utility strings in markup would be copied between React and Vue and could drift. Semantic classes keep markup identical and put all visual rules in one package (FR-001, FR-006). Adding a component means adding one file and one import line (SC-003).
- **Alternatives**: DaisyUI utility classes written directly in each app's markup (duplicated, drift-prone); Tailwind `@source` over app files (couples the package to app paths).
- **Risk to verify**: `@apply` of DaisyUI component classes inside shared CSS must resolve in v4. Quickstart step 3 checks it; fallback is to apply Tailwind utilities and token variables directly (`var(--color-primary)`).

## 5. Making "no hard-coded values" testable

- **Decision**: Vitest tests read the CSS files as text: required tokens exist in `tokens.css`, each component file exists and is imported by `styles.css`, and component/base files contain no hex, `rgb(`, `hsl(`/`oklch(` literals nor raw `px`/`rem` values outside token use.
- **Rationale**: Gives a red-first test (constitution IV) for FR-004, FR-006 without screenshot tooling, matching the manual visual review chosen in clarification.
- **Alternatives**: Visual regression screenshots (rejected in clarification).

## 6. Responsive, accessibility, theme

- **Decision**: Mobile-first layout with a max content width token; visible focus ring via DaisyUI focus styles; token colors chosen for WCAG AA contrast (checked manually once on the palette); `prefers-reduced-motion` respected by limiting transitions to short color changes and disabling them under reduced motion; theme forced to light (no `prefers-color-scheme` switching).
- **Rationale**: Covers FR-008 to FR-010 and the dark-mode edge case. A second theme can later be added as another DaisyUI theme block without changing components.

## 7. Adoption by an app

- **Decision**: One step: add `@todolist/design-tokens` as a dependency, add the Tailwind Vite plugin, and `@import "@todolist/design-tokens/styles.css";` in the app's entry CSS.
- **Rationale**: Satisfies FR-012 and SC-004.
