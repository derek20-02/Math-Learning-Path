/**
 * Difficulty levels available for a learning activity.
 */
export const ACTIVITY_DIFFICULTIES = [
  "easy",
  "medium",
  "hard",
] as const;

export type ActivityDifficulty =
  (typeof ACTIVITY_DIFFICULTIES)[number];

/**
 * Lifecycle states for a learning activity.
 */
export const ACTIVITY_STATUSES = [
  "draft",
  "published",
  "archived",
] as const;

export type ActivityStatus =
  (typeof ACTIVITY_STATUSES)[number];

/**
 * Represents a learning activity created by a teacher.
 */
export interface LearningActivity {
  id: string;

  // The teacher who owns the activity.
  teacherId: string;

  // Mathematics learning objective.
  objective: string;

  // Description or instructions for students.
  description: string;

  // Activity difficulty.
  difficulty: ActivityDifficulty;

  // Current lifecycle state.
  status: ActivityStatus;

  // Automatically managed timestamps.
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Information a teacher provides when creating an activity.
 *
 * id, teacherId, status, and timestamps are managed
 * by the server and are not supplied by the form.
 */
export interface CreateLearningActivityInput {
  objective: string;
  description: string;
  difficulty: ActivityDifficulty;
}