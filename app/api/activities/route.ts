import { NextRequest, NextResponse } from "next/server";

import {
    ACTIVITY_DIFFICULTIES,
    ActivityDifficulty,
    CreateLearningActivityInput,
} from "@/db/schema/learning-activity";

/**
 * Checks whether a value is a valid activity difficulty.
 */
function isValidDifficulty(value: unknown): value is ActivityDifficulty {
    return (
        typeof value === "string" &&
        ACTIVITY_DIFFICULTIES.includes(value as ActivityDifficulty)
    );
}

/**
 * POST /api/activities
 *
 * Creates a new learning activity.
 *
 * Teacher authentication and database persistence will be connected
 * to the shared project foundation when those modules are available.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { objective, description, difficulty } = body;

        // Validate required text fields.
        if (
            typeof objective !== "string" ||
            objective.trim() === "" ||
            typeof description !== "string" ||
            description.trim() === ""
        ) {
            return NextResponse.json(
                {
                    error: "Objective and description are required.",
                },
                { status: 400 },
            );
        }

        // Validate difficulty.
        if (!isValidDifficulty(difficulty)) {
            return NextResponse.json(
                {
                    error: "Difficulty must be easy, medium, or hard.",
                },
                { status: 400 },
            );
        }

        const activityInput: CreateLearningActivityInput = {
            objective: objective.trim(),
            description: description.trim(),
            difficulty,
        };

        /*
         * TODO:
         * 1. Get the authenticated user from the shared session/auth module.
         * 2. Verify that the user has the teacher role.
         * 3. Save activityInput to the shared database.
         *
         * These dependencies are part of the project foundation and are
         * not yet available on main.
         */

        return NextResponse.json(
            {
                message: "Activity data is valid.",
                activity: activityInput,
            },
            { status: 200 },
        );
    } catch {
        return NextResponse.json(
            {
                error: "Invalid request body.",
            },
            { status: 400 },
        );
    }
}