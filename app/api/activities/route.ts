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
 * Validates the information required to create a learning activity.
 *
 * Database persistence will be connected to the team's shared
 * ActivityModel once the database implementation is available
 * on the working branch.
 */
export async function POST(request: NextRequest) {
    try {
        const body: unknown = await request.json();

        if (
            typeof body !== "object" ||
            body === null ||
            Array.isArray(body)
        ) {
            return NextResponse.json(
                { error: "Invalid request body." },
                { status: 400 },
            );
        }

        const {
            title,
            objective,
            description,
            difficulty,
        } = body as Record<string, unknown>;

        // Validate title.
        if (
            typeof title !== "string" ||
            title.trim().length < 3
        ) {
            return NextResponse.json(
                {
                    error: "Title must contain at least 3 characters.",
                },
                { status: 400 },
            );
        }

        // Validate objective.
        if (
            typeof objective !== "string" ||
            objective.trim().length < 5
        ) {
            return NextResponse.json(
                {
                    error: "Objective must contain at least 5 characters.",
                },
                { status: 400 },
            );
        }

        // Validate description.
        if (
            typeof description !== "string" ||
            description.trim().length < 10
        ) {
            return NextResponse.json(
                {
                    error: "Description must contain at least 10 characters.",
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
            title: title.trim(),
            objective: objective.trim(),
            description: description.trim(),
            difficulty,
        };

        /*
         * TODO:
         * Connect this POST endpoint to the team's shared ActivityModel
         * after the database implementation is merged into main.
         *
         * The server will also provide:
         * - teacherId from authentication
         * - status
         * - createdAt
         * - updatedAt
         */

        return NextResponse.json(
            {
                message: "Activity data is valid and ready to be saved.",
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