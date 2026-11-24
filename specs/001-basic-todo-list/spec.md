# Feature Specification: Basic Todo List

**Feature Branch**: `001-basic-todo-list`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "A minimal todo list app for a single user. The user can add a todo with a title, see all todos in a list, mark a todo as done or not done, and delete a todo. Empty or whitespace-only titles are rejected. Todos are not persisted between visits yet."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add and see todos (Priority: P1)

A user opens the app and types the title of something they need to do, then submits it. The new todo appears in the list, so the user can see everything they have to do in one place.

**Why this priority**: Without the ability to add and view todos, the app has no value. This is the smallest slice that is usable on its own.

**Independent Test**: Can be fully tested by adding a few todos and checking that each one appears in the list with the title that was entered.

**Acceptance Scenarios**:

1. **Given** an empty list, **When** the user adds a todo titled "Buy milk", **Then** the list shows one todo titled "Buy milk" that is not done.
2. **Given** a list with one todo, **When** the user adds a second todo, **Then** the list shows both todos, with the newest one after the existing one.
3. **Given** the user has just added a todo, **When** the list is displayed, **Then** the title input is empty and ready for the next todo.

---

### User Story 2 - Reject invalid titles (Priority: P2)

A user submits a todo with an empty title or a title made only of spaces. The app refuses it and tells the user why, so the list never contains meaningless entries.

**Why this priority**: Protects the quality of the list. It depends on the add action from User Story 1.

**Independent Test**: Can be fully tested by submitting an empty title and a whitespace-only title, then checking that the list is unchanged and a message is shown.

**Acceptance Scenarios**:

1. **Given** any list, **When** the user submits an empty title, **Then** no todo is added and the user sees a message explaining that a title is required.
2. **Given** any list, **When** the user submits a title made only of spaces, **Then** no todo is added and the user sees the same message.
3. **Given** a title with leading or trailing spaces such as "  Buy milk  ", **When** the user submits it, **Then** the todo is added with the title "Buy milk".

---

### User Story 3 - Mark a todo as done or not done (Priority: P2)

A user marks a todo as done when they have completed it, and can change it back to not done if they made a mistake. Done todos are visibly different from the others.

**Why this priority**: Tracking progress is the core purpose of a todo list. It depends on the list from User Story 1.

**Independent Test**: Can be fully tested by adding a todo, marking it done, checking its appearance, then marking it not done again.

**Acceptance Scenarios**:

1. **Given** a todo that is not done, **When** the user marks it as done, **Then** it is shown as done and stays in its position in the list.
2. **Given** a todo that is done, **When** the user marks it as not done, **Then** it is shown as not done again.
3. **Given** a list with several todos, **When** the user marks one as done, **Then** the other todos keep their state.

---

### User Story 4 - Delete a todo (Priority: P3)

A user removes a todo they no longer want, whether it is done or not.

**Why this priority**: Useful for keeping the list tidy, but the list is already usable without it.

**Independent Test**: Can be fully tested by adding two todos, deleting one, and checking that only the other remains.

**Acceptance Scenarios**:

1. **Given** a list with several todos, **When** the user deletes one, **Then** it disappears from the list and the others remain unchanged and in the same order.
2. **Given** a list with a single todo, **When** the user deletes it, **Then** the list is empty and the app shows that there are no todos.
3. **Given** a todo that is done, **When** the user deletes it, **Then** it is removed in the same way as a todo that is not done.

---

### Edge Cases

- Submitting a title with only spaces, tabs, or line breaks is treated as empty and rejected.
- Two todos with the same title are allowed and are treated as two separate todos: deleting or marking one does not affect the other.
- A very long title is accepted and remains readable in the list without breaking the layout.
- Reloading or leaving the app loses the list. This is expected for this version (see Assumptions).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to add a todo by entering a title and submitting it.
- **FR-002**: The system MUST display all todos in a list, in the order they were added.
- **FR-003**: The system MUST show, for each todo, its title and whether it is done.
- **FR-004**: The system MUST reject a title that is empty or contains only whitespace, leave the list unchanged, and tell the user that a title is required.
- **FR-005**: The system MUST remove leading and trailing whitespace from a title before saving it.
- **FR-006**: Users MUST be able to mark a todo as done and mark it as not done again.
- **FR-007**: The system MUST make done todos visually distinguishable from todos that are not done.
- **FR-008**: Users MUST be able to delete any todo, whether it is done or not.
- **FR-009**: The system MUST show a clear message when the list contains no todos.
- **FR-010**: New todos MUST start as not done.
- **FR-011**: The system MUST NOT keep todos between visits: each visit starts with an empty list.

### Key Entities *(include if feature involves data)*

- **Todo**: One thing the user needs to do. Has a title (non-empty text without leading or trailing whitespace), a done state (done or not done), and an identity that distinguishes it from every other todo, even one with the same title.
- **Todo List**: The ordered collection of todos shown to the user, in the order they were added.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can add their first todo in under 10 seconds without any instructions.
- **SC-002**: 100% of submissions with an empty or whitespace-only title are rejected, and the list is unchanged in each case.
- **SC-003**: Marking a todo as done or not done, or deleting it, is reflected in the list immediately, with no visible delay.
- **SC-004**: A user can add, complete, and delete a todo in a single session of under 1 minute.
- **SC-005**: After any sequence of add, mark, and delete actions, the list shows exactly the todos that were added and not deleted, each with its latest done state.

## Assumptions

- The app is used by a single user: there are no accounts, sharing, or multiple lists.
- Persistence between visits is out of scope for this feature and will be specified separately, so the list starts empty on every visit.
- Editing a todo's title, filtering the list, counters, and bulk actions are out of scope for this feature.
- Todos are shown in the order they were added; sorting and reordering are out of scope.
- The app is used on a standard web browser, on desktop or mobile screen sizes.
- There is no maximum number of todos and no maximum title length requirement beyond what remains readable.
