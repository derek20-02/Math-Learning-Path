# Math Learning Path Implementation Tasks

**Feature**: [Math Learning Path specification](spec.md)
**Stack**: Next.js App Router, TypeScript strict mode, Tailwind CSS, Auth.js
**Organization**: Tasks are grouped by user story. `[BE]`, `[FE]`, and `[DB]` identify backend, frontend, and database work.

## Phase 1: Foundation

-`dani71296`

- [] T001 [P] [DB] Select the persistence provider and add environment-variable documentation in `.env` and group chat.
- [] T002 [P] [BE] Configure Auth.js, session handling, and role claims in `auth.ts` and `app/api/auth/[...nextauth]/route.ts`.
- [] T003 [P] [BE] Create shared authorization and request-validation helpers in `lib/auth/` and `lib/validation/`.
- [] T004 [P] [BE] Configure API error handling and privacy-conscious structured logging in `lib/errors/` and `lib/logging/`.
- [] T005 [P] [FE] Create shared layout, navigation, form, loading, empty, and error UI in `app/components/`.
- [] T006 [P] [FE] Add the selected test runner, accessibility checks, and `test` script to `package.json`.
- [] T007 [DB] Define User, LearningActivity, Exercise, Assignment, Submission, and ProgressRecord schema and migrations in `db/schema/`.
- [] T008 [BE] Add typed domain models and repository/service boundaries in `lib/domain/`.

**Checkpoint**: Authentication, authorization, persistence, validation, error handling, and test tooling are ready.

## User Story 1: Sign Up and Role-Based Access (P1)

-`dani71296`

- [ ] T009 [P] [DB] Add unique account identity and role constraints in `db/schema/user.ts`.
- [ ] T010 [P] [BE] Implement `POST /api/auth/signup` validation and account creation in `app/api/auth/signup/route.ts`.
- [ ] T011 [P] [FE] Build sign-up and login forms in `app/(auth)/signup/page.tsx` and `app/(auth)/login/page.tsx`.
- [ ] T012 [BE] Enforce role-aware redirects and protected route behavior in `middleware.ts` and `lib/auth/authorization.ts`.
- [ ] T013 [FE] Add role-specific home layouts in `app/(teacher)/layout.tsx` and `app/(student)/layout.tsx`.
- [ ] T014 [P] [BE] Add authentication and cross-role authorization tests in `tests/integration/auth.test.ts`.
- [ ] T015 [P] [FE] Add keyboard and validation-state tests for auth forms in `tests/e2e/auth.spec.ts`.

## User Story 2: Create a Learning Activity (P1)

-`Ivanov1979`

- [ ] T016 [DB] Add LearningActivity fields, difficulty values, ownership, and timestamps in `db/schema/learning-activity.ts`.
- [ ] T017 [BE] Implement `POST /api/activities` with teacher authorization and validation in `app/api/activities/route.ts`.
- [ ] T018 [FE] Build the teacher activity creation form in `app/(teacher)/activities/new/page.tsx`.
- [ ] T019 [FE] Add reusable activity fields and difficulty selector in `app/components/activities/activity-form.tsx`.
- [ ] T020 [P] [BE] Test valid, incomplete, and unauthorized activity creation in `tests/integration/activities-create.test.ts`.
- [ ] T021 [P] [FE] Test form submission, errors, and accessible labels in `tests/e2e/activity-create.spec.ts`.

## User Story 3: Read Learning Activities (P1)

-`derek20-02`

- [ ] T022 [BE] Implement `GET /api/activities` and `GET /api/activities/:activityId` with role-scoped visibility.
- [ ] T023 [FE] Build teacher activity list and detail pages in `app/(teacher)/activities/page.tsx` and `app/(teacher)/activities/[activityId]/page.tsx`.
- [ ] T024 [FE] Build assigned student activity list and detail pages in `app/(student)/learning-path/page.tsx` and `app/(student)/learning-path/[activityId]/page.tsx`.
- [ ] T025 [FE] Add loading, empty, unavailable, and unauthorized states for activity views.
- [ ] T026 [P] [BE] Test cross-owner and cross-role activity visibility in `tests/integration/activities-read.test.ts`.
- [ ] T027 [P] [FE] Test teacher and student activity navigation in `tests/e2e/activity-read.spec.ts`.

## User Story 4: Update a Learning Activity (P1)

-`Ivanov1979`

- [ ] T028 [BE] Implement `PATCH /api/activities/:activityId` with ownership and field validation.
- [ ] T029 [FE] Build the teacher activity edit page and optimistic-state rollback in `app/(teacher)/activities/[activityId]/edit/page.tsx`.
- [ ] T030 [P] [BE] Test successful edits, invalid edits, and student denial in `tests/integration/activities-update.test.ts`.
- [ ] T031 [P] [FE] Test edit form error and success states in `tests/e2e/activity-update.spec.ts`.

## User Story 5: Delete a Learning Activity (P2)

-`derek20-02`

- [ ] T032 [BE] Implement `DELETE /api/activities/:activityId` with confirmation-safe historical progress handling.
- [ ] T033 [FE] Add accessible delete confirmation and cancellation flow to `app/(teacher)/activities/[activityId]/page.tsx`.
- [ ] T034 [DB] Define deletion/archive behavior that preserves required historical submissions and progress.
- [ ] T035 [P] [BE] Test delete, cancel, authorization, and historical data behavior in `tests/integration/activities-delete.test.ts`.
- [ ] T036 [P] [FE] Test confirmation, cancellation, and success feedback in `tests/e2e/activity-delete.spec.ts`.

## User Story 6: Manage Exercises and Submit Answers (P1)

-`helaman-Y-B`

- [ ] T037 [DB] Add Exercise, Assignment, and Submission relationships and answer metadata in `db/schema/exercise.ts`.
- [ ] T038 [BE] Implement exercise list/create routes at `app/api/activities/[activityId]/exercises/route.ts`.
- [ ] T039 [BE] Implement exercise update/delete routes at `app/api/exercises/[exerciseId]/route.ts`.
- [ ] T040 [BE] Implement assignment creation at `app/api/assignments/route.ts` with teacher scope checks.
- [ ] T041 [BE] Implement `POST /api/exercises/:exerciseId/submissions` and consistent retry handling.
- [ ] T042 [FE] Build teacher exercise manager and assignment controls in `app/(teacher)/activities/[activityId]/exercises/`.
- [ ] T043 [FE] Build student exercise workspace and answer submission UI in `app/(student)/learning-path/[activityId]/exercises/`.
- [ ] T044 [P] [BE] Test exercise CRUD, assignment scope, answer validation, and retries in `tests/integration/exercises.test.ts`.
- [ ] T045 [P] [FE] Test teacher and student exercise flows in `tests/e2e/exercises.spec.ts`.

## User Story 7: Track Student and Teacher Progress (P2)

-`helaman-Y-B`

- [ ] T046 [DB] Add progress indexes and consistent aggregation fields for assignments and submissions.
- [ ] T047 [BE] Implement `GET /api/student/dashboard` with student-only progress scope.
- [ ] T048 [BE] Implement `GET /api/teacher/progress` with authorized-student filtering.
- [ ] T049 [FE] Build the student dashboard in `app/(student)/dashboard/page.tsx`.
- [ ] T050 [FE] Build teacher progress dashboard and student detail view in `app/(teacher)/progress/page.tsx`.
- [ ] T051 [FE] Add not-started, incomplete, completed, and error states using text plus non-color indicators.
- [ ] T052 [P] [BE] Test dashboard totals, empty states, incomplete work, and data isolation in `tests/integration/progress.test.ts`.
- [ ] T053 [P] [FE] Test both dashboards against completed and incomplete scenarios in `tests/e2e/progress.spec.ts`.

## Phase 8: Cross-Cutting Quality

- [ ] T054 [P] Add responsive and keyboard accessibility checks for every protected workflow.
- [ ] T055 [P] Add regression coverage for server failures and no-partial-write behavior.
- [ ] T056 Run lint, typecheck, test, and production build checks; document commands in `README.md`.
- [ ] T057 Review logs and error responses for unnecessary sensitive student information.

## Dependencies and Delivery Order

1. Foundation tasks T001-T008 block all user stories.
2. User Stories 1, 2, 3, and 4 form the P1 teacher/content slice and can proceed in parallel after foundation.
3. User Story 6 depends on activities and assignments from T016-T024, then enables the core student learning loop.
4. User Story 5 depends on activity ownership and historical data decisions.
5. User Story 7 depends on assignments and submissions, especially T040-T041.
6. Cross-cutting quality tasks run after each story and are required before release.

## Issue Mapping

- ML-001: Authentication and role-based access
- ML-002: Learning activity database and create API
- ML-003: Teacher activity management UI
- ML-004: Activity read and student learning path
- ML-005: Activity update and delete
- ML-006: Exercise management, assignments, and student submissions
- ML-007: Student and teacher progress dashboards
