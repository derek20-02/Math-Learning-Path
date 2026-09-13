<!--
Sync Impact Report
- Version change: none (initial constitution) -> 1.0.0
- Modified principles: none; this is the initial project constitution.
- Added sections: Product Mission, Core Principles I-VIII, Governance.
- Removed sections: none.
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (existing Constitution Check aligns with this constitution)
  - ✅ .specify/templates/spec-template.md (independent stories, requirements, and measurable outcomes align)
  - ✅ .specify/templates/tasks-template.md (story-based delivery and automated-test expectations align)
  - ⚠ .specify/templates/commands/*.md (directory is absent; add command templates before command-specific governance checks)
- Follow-up TODO: establish the original ratification date in the Ratification Date field.
-->

# Math Learning Path Constitution

## Metadata

- **Version**: 1.0.0
- **Ratification Date**: TODO(RATIFICATION_DATE): original adoption date is not recorded
- **Last Amended Date**: 2026-09-13

## Product Mission

Math Learning Path MUST help students develop mathematics skills through structured learning
activities and practice exercises. The product MUST give teachers practical tools to create,
organize, assign, and monitor learning work, while giving students a clear interface for
completing assignments and tracking progress.

All feature decisions MUST preserve the distinction between teacher-authorized management and
student learning workflows. Learning value, clarity, and trustworthy progress information take
priority over decorative complexity.

## Core Principles

### I. Learning Outcomes First

Every user-facing feature MUST identify the learning outcome or teaching workflow it supports.
Feature specifications MUST express independently testable user stories, acceptance scenarios,
and measurable success criteria. A feature without a clear educational or instructional purpose
MUST NOT proceed without an explicit exception recorded in its plan.

**Rationale:** The application exists to improve mathematics learning, not merely to provide
content management or generic productivity features.

### II. Safe Roles and Data Stewardship

The system MUST enforce the distinction between teacher and student capabilities at every
server-side data boundary. Teachers MUST only access the classes, activities, assignments, and
progress data they are authorized to manage. Students MUST only access their own assigned work
and permitted progress information. Sensitive student data MUST be minimized, validated, and
excluded from logs unless required for an approved operational purpose.

**Rationale:** Educational trust depends on correct authorization and responsible handling of
student information; client-side visibility checks alone are insufficient.

### III. TypeScript and Naming Discipline

All application code MUST use TypeScript in strict mode. The codebase MUST NOT introduce
`any`; unknown external data MUST be narrowed or validated before use. Names MUST be descriptive,
consistent with the surrounding module, and follow these conventions: PascalCase for React
components and types, camelCase for variables, functions, and hooks, and kebab-case for URL
segments and route folders where practical. Public interfaces MUST use domain language such as
student, teacher, activity, assignment, and progress consistently.

**Rationale:** Strong types and predictable names make educational workflows safer to change and
easier for the team to understand.

### IV. Next.js Boundary and Routing Discipline

The application MUST use Next.js App Router and file-based routing. Components MUST remain
server components by default; a component MAY be marked client-side only when it requires browser
APIs, local interaction state, or event handlers. Data access, authorization checks, and trusted
mutations MUST execute on the server. Server/client boundaries MUST pass only serializable,
minimal data. Route and layout structure MUST reflect the user workflow rather than duplicate
navigation logic.

**Rationale:** Explicit boundaries protect data and keep the application efficient while still
supporting interactive practice experiences.

### V. Tailwind-First UI

Styling MUST use Tailwind CSS utilities and the existing design conventions first. Custom CSS
MAY be added only when a utility or shared component cannot express the required behavior, and
such CSS MUST have a specific documented reason in the implementation plan. User interfaces MUST
remain responsive, keyboard accessible, readable, and consistent across teacher and student
workflows.

**Rationale:** A utility-first approach keeps visual decisions local, reduces style drift, and
supports a coherent learning experience.

### VI. Tested and Observable Behavior

New behavior MUST include automated tests at the narrowest useful level: unit tests for isolated
logic, integration tests for server/data contracts, and end-to-end tests for critical teacher or
student journeys. User-facing workflows MUST include accessibility checks. Every defect fix MUST
add or update a regression test when practical. Features that mutate assignments, submissions,
or progress MUST provide actionable error handling and enough structured logging to diagnose
failures without exposing sensitive student data.

The repository MUST provide a documented test command before production-facing feature work is
considered complete. Configuration-only or documentation-only changes MAY omit automated tests
when the reason is recorded in the change description.

**Rationale:** Learning progress is consequential; correctness, accessibility, and diagnosability
must be verified rather than assumed.

### VII. Small, Reviewable Changes

Implementations MUST prefer the simplest design that satisfies the requirements and MUST avoid
unrelated refactors. Each change MUST keep its scope visible through a focused specification,
plan, or issue and MUST preserve existing public behavior unless a breaking change is explicitly
approved. Plans MUST document complexity exceptions and their rejected simpler alternatives.

**Rationale:** Small changes are easier to review, test, revert, and coordinate across a student
team working on a shared application.

### VIII. Collaborative Delivery

Team members MUST coordinate ownership before editing shared surfaces, use descriptive branch and
commit names, and keep pull requests focused on one coherent outcome. Reviews MUST check user
stories, authorization, strict typing, server/client boundaries, accessibility, tests, and
regressions. Contributors MUST update relevant README, quickstart, or feature documentation when
behavior or setup changes. Review feedback MUST be addressed or explicitly documented before
merge.

**Rationale:** Consistent collaboration practices reduce integration conflicts and make the
project understandable to every team member.

## Governance

### Amendment Procedure

Any team member MAY propose an amendment by documenting the motivation, affected principles,
compatibility impact, and required template or documentation updates. At least one other team
member MUST review the proposal. The constitution file and all affected dependent artifacts MUST
be updated together. The change is effective only after the team approves it through the
repository's normal review process.

### Versioning Policy

The constitution follows semantic versioning:

- **MAJOR** increments for removing or redefining a principle in a backward-incompatible way.
- **MINOR** increments for adding a principle or materially expanding mandatory governance.
- **PATCH** increments for clarifications, wording changes, and non-semantic corrections.

Every amendment MUST update `Last Amended Date`, the version, and the Sync Impact Report. The
ratification date MUST remain unchanged after it is established.

### Compliance Review

Plans MUST include a Constitution Check before research and again after design. Tasks MUST map
implementation and test work to independently verifiable user stories. Reviewers MUST reject or
request documented exceptions for unchecked mandatory gates. At minimum, the team MUST review
constitution compliance at feature planning, pull request review, and release readiness.

When this constitution conflicts with a framework default, the constitution governs project
practice unless the team approves and records an amendment.
