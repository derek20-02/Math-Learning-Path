export type Difficulty = "beginner" | "intermediate" | "advanced";

export type ActivityStatus = "not-started" | "in-progress" | "completed";

export type Activity = {
  id: string;
  objective: string;
  description: string;
  difficulty: Difficulty;
  exerciseCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ActivityProgress = Activity & {
  assignmentCount: number;
  assignedStudents: string[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
};

export type StudentActivity = Activity & {
  status: ActivityStatus;
  completedExercises: number;
  assignedAt: string;
};

export type Exercise = {
  _id: string;
  activityId: string;
  isActive?: boolean;
  prompt: string;
  answerRules: AnswerRules;
  choices?: string[];
  //correctAnswer: string;
  //submittedAnswer: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExerciseAssignmentOption = Omit<Exercise, "activityId"> & {
  activityId?: string | null;
  assignedActivityId: string | null;
};

export type AnswerRules = {
  type: "multiple-choice" | "short-answer" | "true-false" | "numeric";
  expected: string | string[] | boolean;
  tolerance?: number;
};

export type Submission = {
  _id: string;
  exerciseId: string;
  studentId: string;
  assignmentId: string;
  answer: string | null;
  attemptNumber: number;
  isCorrect: boolean;
  status: "submitted" | "graded" | "pending";
  submittedAt: Date;
};
