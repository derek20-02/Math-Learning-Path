import { NextRequest, NextResponse } from "next/server";

import {
    ACTIVITY_DIFFICULTIES,
    ActivityDifficulty,
} from "@/db/schema/learning-activity";

function isValidDifficulty(value: unknown): value is ActivityDifficulty {
    return (
        typeof value === "string" &&
        ACTIVITY_DIFFICULTIES.includes(value as ActivityDifficulty)
    );
}

interface UpdateActivityInput {
    objective?: string;
    description?: string;
    difficulty?: ActivityDifficulty;
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ activityId: string }> },
) {
    try {
        const { activityId } = await context.params;

        if (!activityId || activityId.trim() === "") {
            return NextResponse.json(
                { error: "Activity ID is required." },
                { status: 400 },
            );
        }

        const body = await request.json();

        const { objective, description, difficulty } = body;

        // At least one editable field must be supplied.
        if (
            objective === undefined &&
            description === undefined &&
            difficulty === undefined
        ) {
            return NextResponse.json(
                { error: "At least one activity field must be provided." },
                { status: 400 },
            );
        }

        // Validate objective when supplied.
        if (
            objective !== undefined &&
            (typeof objective !== "string" || objective.trim() === "")
        ) {
            return NextResponse.json(
                { error: "Objective cannot be empty." },
                { status: 400 },
            );
        }

        // Validate description when supplied.
        if (
            description !== undefined &&
            (typeof description !== "string" || description.trim() === "")
        ) {
            return NextResponse.json(
                { error: "Description cannot be empty." },
                { status: 400 },
            );
        }

        // Validate difficulty when supplied.
        if (
            difficulty !== undefined &&
            !isValidDifficulty(difficulty)
        ) {
            return NextResponse.json(
                { error: "Difficulty must be easy, medium, or hard." },
                { status: 400 },
            );
        }

        const updates: UpdateActivityInput = {};

        if (objective !== undefined) {
            updates.objective = objective.trim();
        }

        if (description !== undefined) {
            updates.description = description.trim();
        }

        if (difficulty !== undefined) {
            updates.difficulty = difficulty;
        }

        /*
         * TODO: Connect to the shared project Foundation.
         *
         * 1. Get the authenticated user from the session.
         * 2. Reject unauthenticated users.
         * 3. Verify that the authenticated user is a teacher.
         * 4. Find the activity by activityId.
         * 5. Verify that activity.teacherId matches the authenticated teacher.
         * 6. Update the activity in the database.
         * 7. Update updatedAt.
         *
         * Ownership and persistence cannot be completed until the team's
         * shared authentication/database Foundation is available.
         */

        return NextResponse.json(
            {
                message: "Activity update data is valid.",
                activityId,
                updates,
            },
            { status: 200 },
        );
    } catch {
        return NextResponse.json(
            { error: "Invalid request body." },
            { status: 400 },
        );
    }
}