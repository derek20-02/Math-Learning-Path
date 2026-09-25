import type { StudentActivity } from "@/lib/types";

/**
 * Temporary in-memory activity data used until the activities API and database
 * are available.
 */
export const activities: StudentActivity[] = [
    {
        id: "fractions-foundations",
        objective: "Understand equivalent fractions",
        description:
            "Use visual models and number lines to identify and compare equivalent fractions.",
        difficulty: "beginner",
        exerciseCount: 8,
        completedExercises: 0,
        status: "not-started",
        createdAt: "2026-09-20T09:00:00.000Z",
        updatedAt: "2026-09-20T09:00:00.000Z",
        assignedAt: "2026-09-21T09:00:00.000Z",
    },
    {
        id: "linear-equations",
        objective: "Solve one-step linear equations",
        description:
            "Practice isolating a variable and checking solutions for one-step equations.",
        difficulty: "intermediate",
        exerciseCount: 10,
        completedExercises: 6,
        status: "in-progress",
        createdAt: "2026-09-18T10:30:00.000Z",
        updatedAt: "2026-09-22T14:15:00.000Z",
        assignedAt: "2026-09-19T09:00:00.000Z",
    },
    {
        id: "area-and-perimeter",
        objective: "Apply area and perimeter formulas",
        description:
            "Choose the right formula and solve real-world problems with rectangles and triangles.",
        difficulty: "advanced",
        exerciseCount: 6,
        completedExercises: 6,
        status: "completed",
        createdAt: "2026-09-12T08:00:00.000Z",
        updatedAt: "2026-09-23T16:45:00.000Z",
        assignedAt: "2026-09-13T09:00:00.000Z",
    },
];
