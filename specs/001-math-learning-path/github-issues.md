# GitHub Issue Drafts: Math Learning Path

These seven issues cover the highest-priority stories in `spec.md`. Create each issue in order,
then add it to the Math Learning Path project board. Suggested labels: `feature`, `P1` or `P2`,
and the listed area label.

## ML-001: Authentication and Role-Based Access

**Labels**: `feature`, `P1`, `area:auth`

### User Story

As a teacher or student, I want to sign up and log in with my role so that I can use the correct
interface and protected capabilities.

### Scope

- Add Auth.js sign-up, login, logout, and session expiration.
- Persist exactly one teacher or student role per account.
- Redirect users to role-specific home areas.
- Enforce authorization on the server for protected routes and operations.
- Return clear validation errors without exposing account or student data.

### Acceptance Criteria

- [ ] A visitor can create a valid teacher account and reaches the teacher interface.
- [ ] A visitor can create a valid student account and reaches the student interface.
- [ ] Duplicate or invalid registration details are rejected without creating an account.
- [ ] A student cannot invoke a teacher-only operation or view teacher-owned data.
- [ ] An unauthenticated request to a protected operation is denied.
- [ ] Authentication and authorization tests cover valid, invalid, expired, and cross-role cases.

## ML-002: Learning Activity Data Model and Create API

**Labels**: `feature`, `P1`, `area:backend`, `area:database`

### User Story

As a teacher, I want to create a learning activity with an objective, description, and difficulty
so that students have organized mathematics practice.

### Scope

- Define the learning activity persistence model and teacher ownership.
- Add validation for objective, description, and difficulty.
- Implement `POST /api/activities` for authorized teachers.
- Reject malformed input and prevent partial writes.
- Add unit/integration coverage for validation and authorization.

### Acceptance Criteria

- [ ] A signed-in teacher can create an activity with valid required fields.
- [ ] The created activity is owned by the requesting teacher.
- [ ] Missing or invalid fields return a clear validation error and do not create a record.
- [ ] Students and unauthenticated users cannot create activities.
- [ ] The endpoint returns a typed response containing the created activity identity and details.
- [ ] Database constraints prevent invalid difficulty values and missing ownership.

## ML-003: Teacher Activity Management Interface

**Labels**: `feature`, `P1`, `area:frontend`

### User Story

As a teacher, I want a focused activity form so that I can create mathematics content efficiently.

### Scope

- Build the teacher activity creation page and reusable form fields.
- Use Tailwind utilities and responsive layouts.
- Provide labels, validation messages, loading state, success feedback, and error recovery.
- Keep browser interaction in client components while data and authorization remain server-owned.

### Acceptance Criteria

- [ ] The form exposes objective, description, and difficulty fields with accessible labels.
- [ ] Invalid submission identifies the affected fields and preserves entered values.
- [ ] Successful submission confirms creation and links to the activity list or detail page.
- [ ] Server failures leave the form usable and provide a retry path.
- [ ] The workflow is keyboard navigable and does not rely on color alone for status.
- [ ] Responsive tests cover mobile and desktop layouts.

## ML-004: Activity Reading and Student Learning Path

**Labels**: `feature`, `P1`, `area:frontend`, `area:backend`

### User Story

As a teacher, I want to view my activities, and as a student, I want to view activities assigned to
me, so that each user can understand available work.

### Scope

- Implement `GET /api/activities` and `GET /api/activities/:activityId`.
- Scope teacher results to owned activities and student results to assigned activities.
- Build teacher list/detail views and student learning-path list/detail views.
- Add loading, empty, unavailable, and unauthorized states.

### Acceptance Criteria

- [ ] Teachers see their own activities with objectives and difficulty levels.
- [ ] Students see only activities assigned to them and their completion status.
- [ ] A user cannot read another teacher’s activity through list or detail endpoints.
- [ ] Empty results show an informative next step.
- [ ] Missing or unavailable activities show a clear not-found state.
- [ ] Integration and end-to-end tests verify role and ownership filtering.

## ML-005: Activity Update and Delete

**Labels**: `feature`, `P1`, `P2`, `area:backend`, `area:frontend`

### User Story

As a teacher, I want to update or delete an activity I own so that learning content stays accurate
and obsolete work is no longer offered.

### Scope

- Implement `PATCH /api/activities/:activityId` and `DELETE /api/activities/:activityId`.
- Build edit and accessible confirmation flows.
- Reject invalid edits and unauthorized mutations.
- Preserve or explicitly resolve historical submissions and progress when content is deleted.

### Acceptance Criteria

- [ ] A teacher can update valid fields on an activity they own.
- [ ] Invalid updates leave the existing activity unchanged.
- [ ] A student or different teacher cannot update or delete the activity.
- [ ] Delete requires explicit confirmation and cancellation preserves the activity.
- [ ] Deleted activities are not offered as new work.
- [ ] Historical progress behavior is preserved and covered by integration tests.

## ML-006: Exercise Management, Assignments, and Student Submissions

**Labels**: `feature`, `P1`, `area:backend`, `area:frontend`, `area:database`

### User Story

As a teacher, I want to manage exercises and assign them, and as a student, I want to submit
answers so that activities provide meaningful mathematics practice.

### Scope

- Define Exercise, Assignment, and Submission data relationships.
- Add exercise list/create/update/delete operations.
- Add assignment creation with teacher scope checks.
- Add `POST /api/exercises/:exerciseId/submissions` for assigned students.
- Apply one documented retry rule and answer-validation behavior.
- Build teacher exercise management and student exercise workspace interfaces.

### Acceptance Criteria

- [ ] A teacher can create, read, update, and delete exercises in an owned activity.
- [ ] A teacher can assign an activity to an authorized student.
- [ ] An assigned student can view exercises and submit an answer.
- [ ] A submission records completion, attempt status, correctness, and submission time.
- [ ] Unassigned students and teachers cannot submit answers as students.
- [ ] Multiple submissions follow one visible, consistently tested retry rule.

## ML-007: Student and Teacher Progress Dashboards

**Labels**: `feature`, `P2`, `area:frontend`, `area:backend`

### User Story

As a student, I want to see my completion and results, and as a teacher, I want to see authorized
student progress, so that both users know what to practice next.

### Scope

- Implement `GET /api/student/dashboard` and `GET /api/teacher/progress`.
- Aggregate assignments, submissions, completion, participation, and results consistently.
- Build student dashboard and teacher progress/detail views.
- Add not-started, incomplete, completed, empty, and error states.
- Protect all progress data by role and relationship.

### Acceptance Criteria

- [ ] Students see only their own assignments, completion, and results.
- [ ] Teachers see participation and individual progress only for authorized students.
- [ ] Dashboard totals match the underlying tested assignment and submission scenarios.
- [ ] No-submission and no-assignment states are explicit and not misleading.
- [ ] Progress remains historically consistent after activity deletion.
- [ ] Dashboard workflows pass keyboard-accessibility and data-isolation tests.

## Board Mapping

| Draft ID | Story | Priority | Board column | Dependencies |
| --- | --- | --- | --- | --- |
| ML-001 | Sign up and role-based access | P1 | Backlog | Foundation |
| ML-002 | Activity data model and create API | P1 | Backlog | Foundation, ML-001 |
| ML-003 | Teacher activity management UI | P1 | Backlog | ML-002 |
| ML-004 | Activity reading and learning path | P1 | Backlog | ML-001, ML-002 |
| ML-005 | Activity update and delete | P1/P2 | Backlog | ML-002, ML-004 |
| ML-006 | Exercises, assignments, submissions | P1 | Backlog | ML-001, ML-002, ML-004 |
| ML-007 | Progress dashboards | P2 | Backlog | ML-006 |

**External action status**: GitHub issue creation and board placement are pending interactive GitHub
authentication. The repository has no `gh` CLI and no API token is available in the environment.
