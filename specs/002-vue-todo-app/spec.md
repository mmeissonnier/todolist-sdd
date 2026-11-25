# Feature Specification: Second Todo List App

**Feature Branch**: `002-vue-todo-app`

**Created**: 2026-11-25

**Status**: Draft

**Input**: User description: "A second app for the basic todo list: same behavior as feature 001, reusing the shared core and the shared end-to-end suite, and satisfying the UI contract."

**Reference**: Behavior is defined once, in [`specs/001-basic-todo-list/spec.md`](../001-basic-todo-list/spec.md). It is not repeated here.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Same todo list in a second app (Priority: P1)

A user opens the second app and manages their todos exactly as in the first one: all four user stories of feature 001 (add and see, reject invalid titles, mark done or not done, delete) behave the same.

**Why this priority**: The only goal of this feature is a second app with identical behavior, so the two can be compared.

**Independent Test**: Run the shared end-to-end suite against the second app, unchanged. All scenarios pass.

**Acceptance Scenarios**:

1. **Given** the second app is running, **When** the shared end-to-end suite is run against it, **Then** every scenario passes with no change to the suite.
2. **Given** any acceptance scenario of feature 001, **When** it is tried by hand on the second app, **Then** it holds.

### Edge Cases

- All edge cases of feature 001 apply unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The second app MUST behave as defined by FR-001 to FR-011 of feature 001.
- **FR-002**: The second app MUST expose the UI described in `specs/001-basic-todo-list/contracts/ui-contract.md`.
- **FR-003**: The second app MUST take all todo rules from the shared core and define none itself.
- **FR-004**: The second app MUST run, be tested and be built without the first app, and adding it MUST NOT change the first app.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the shared end-to-end scenarios pass on the second app, with the suite unchanged.
- **SC-002**: Adding the second app changes no file of the first app, and the first app's checks still pass.

## Assumptions

- Feature 001 is merged and is the reference for behavior; a change to that behavior is made in its spec and applies to both apps.
- The tools used for the second app are chosen in the plan.
