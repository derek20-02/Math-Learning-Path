export type Difficulty = "beginner" | "intermediate" | "advanced";

export type ActivityStatus =
  | "not-started"
  | "in-progress"
  | "completed";

export type Activity = {
    id: string;
    objective: string;
    description: string;
    difficulty: Difficulty;
    exerciseCount: number;
    createdAt: string;
    updatedAt: string;
}

export type StudentActivity = Activity & {
  status: ActivityStatus;
  completedExercises: number;
  assignedAt: string;
};