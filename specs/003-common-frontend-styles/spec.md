# Feature Specification: Common Frontend Styles

**Feature Branch**: `003-common-frontend-styles`

**Created**: 2026-11-26

**Status**: Draft

**Input**: User description: "implements common styles for all frontend project (components and global rules). It should be simple and easily scalable."

## Clarifications

### Session 2026-11-26

- Q: Quelle direction visuelle ? → A: Neutre et minimal (fond clair, une couleur d'accent, texte lisible, composants sobres)
- Q: Comment vérifier le rendu identique entre apps ? → A: Revue visuelle manuelle uniquement, sans test automatisé de captures

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identical look across every app (Priority: P1)

A user opens the todo list in any of the available app implementations. Typography, colors, spacing, and the appearance of the form, buttons, list and items are the same everywhere, so the only difference between implementations is the technology behind them, never the visuals.

**Why this priority**: The project compares implementations of one specification. A shared look makes the comparison fair and is the core value of this feature.

**Independent Test**: Open two different apps side by side with the same todos and compare them visually. They must look identical (same layout, colors, fonts, spacing, states).

**Acceptance Scenarios**:

1. **Given** two apps containing the same todos, **When** they are displayed at the same window size, **Then** the pages are visually indistinguishable.
2. **Given** a todo is completed in one app, **When** the same state is shown in another app, **Then** the completed styling is identical.
3. **Given** the list is empty, **When** displayed in any app, **Then** the empty state looks identical across apps.

---

### User Story 2 - Change a style once, see it everywhere (Priority: P2)

A maintainer wants to adjust a visual choice (for example the main accent color or base font size). They change it in a single shared place, and every app reflects the change without per-app edits.

**Why this priority**: Shared styles only pay off if they are maintained in one place. Without it, apps drift apart again.

**Independent Test**: Change one shared design value, then check that all apps display the new value with no other file edited.

**Acceptance Scenarios**:

1. **Given** a shared design value (e.g. accent color), **When** the maintainer changes it in the single shared location, **Then** every app shows the new value.
2. **Given** a new app implementation is added, **When** it adopts the shared styles, **Then** it matches existing apps without writing its own visual rules.

---

### User Story 3 - Add a new styled component easily (Priority: P3)

A maintainer introduces a new UI element (for example a filter bar). They add its style following an obvious, documented convention, reusing existing shared design values, without touching existing component styles.

**Why this priority**: Scalability is an explicit requirement. The system must stay simple as it grows.

**Independent Test**: Add a new component style following the documented convention; existing component styles remain unchanged and all apps can use it.

**Acceptance Scenarios**:

1. **Given** the documented convention, **When** a maintainer adds styles for a new component, **Then** no existing component style needs to be modified.
2. **Given** a new component style, **When** it is applied in any app, **Then** it uses the shared design values (colors, spacing, typography) rather than hard-coded ones.

---

### Edge Cases

- A browser or window width much narrower than usual (small mobile screen): layout remains readable and usable, with no horizontal scrolling.
- Very long todo titles: text wraps or truncates without breaking the layout.
- A user with a dark system color scheme preference: the light theme is still shown (see Assumptions).
- Keyboard-only navigation: focus is always visibly indicated on interactive elements.
- An app fails to load the shared styles: content remains readable and usable (unstyled fallback), not hidden.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST provide one single shared set of styles consumed by every frontend app; no app MAY define its own visual rules for elements covered by the shared set.
- **FR-002**: The shared styles MUST include global rules: base reset, page typography, page background and text colors, and base layout spacing. The visual direction MUST be neutral and minimal: light background, a single accent color, readable text, and sober components.
- **FR-003**: The shared styles MUST include component styles for every existing UI element: the add-todo form, its input and button, the todo list, a todo item (active and completed states), and the empty state.
- **FR-004**: Visual choices (colors, font sizes, spacing, radii) MUST be defined once as named design values and reused by global rules and component styles; component styles MUST NOT hard-code these values.
- **FR-005**: Changing a named design value MUST update every app with no other edit.
- **FR-006**: Component styles MUST be organized one unit per component, so adding or editing one component's style does not require editing another's.
- **FR-007**: A short written convention MUST describe how to add a new component style and a new design value.
- **FR-008**: Interactive elements MUST show distinct hover, focus, and disabled states.
- **FR-009**: Text and interactive elements MUST meet standard readable contrast levels (WCAG AA).
- **FR-010**: Layout MUST adapt from small mobile screens to large desktop screens without horizontal scrolling.
- **FR-011**: Existing behavior of every app MUST remain unchanged; only presentation is affected, and all existing tests MUST still pass.
- **FR-012**: A new app implementation MUST be able to adopt the shared styles with a single, documented step.

### Key Entities *(include if feature involves data)*

- **Design value**: A named visual choice (color, spacing step, font size, radius) defined once and referenced everywhere.
- **Global rule**: A style applying to the whole page (reset, typography, background, base spacing).
- **Component style**: The visual definition of one UI element and its states, built only from design values.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A manual side-by-side visual review of all apps in the same state (including active, completed and empty states) finds no visible difference in layout, colors, fonts or spacing.
- **SC-002**: Changing one design value requires editing exactly 1 place and is reflected in 100% of apps.
- **SC-003**: Adding a style for a new component requires creating 1 new style unit and modifying 0 existing component styles.
- **SC-004**: Adopting the shared styles in a new app takes 1 documented step and under 5 minutes.
- **SC-005**: 100% of text and interactive elements meet WCAG AA contrast.
- **SC-006**: The page is fully usable, with no horizontal scrolling, from 320 px to 1920 px wide.
- **SC-007**: All existing unit and end-to-end tests pass unchanged after the feature.

## Assumptions

- Scope covers every current app implementation and the elements they already display; no new features or UI elements are added.
- Dark mode is out of scope for this version; a light theme only. The design values structure must not prevent adding a theme later.
- Visual design is neutral and minimal (confirmed in clarification); no external design system or branding is imposed. The apps currently have almost no styling, so the full look is defined by this feature.
- The shared styles live in the shared packages area of the repository, consistent with the existing monorepo layout.
- Visual consistency is verified by manual review; no automated screenshot comparison is added.
- Supported browsers are current evergreen desktop and mobile browsers.
- No animations beyond simple state transitions; reduced-motion preferences are respected.
