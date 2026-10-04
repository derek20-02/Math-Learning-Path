import { NextRequest, NextResponse } from "next/server";

import {
    ACTIVITY_DIFFICULTIES,
    ActivityDifficulty,
    CreateLearningActivityInput,
} from "@/db/schema/learning-activity";

import { getDb } from "@/lib/mongodb";

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
 * Validates and creates a new learning activity.
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

        const db = await getDb();

        const now = new Date();

        /*
         * TODO:
         * Replace this temporary teacherId after the team's authentication
         * implementation is integrated.
         *
         * T017 requires the authenticated teacher to provide ownership.
         */
        const activity = {
            ...activityInput,
            teacherId: null,
            status: "draft",
            createdAt: now,
            updatedAt: now,
        };

        const result = await db
            .collection("learning_Activity")
            .insertOne(activity);

        return NextResponse.json(
            {
                message: "Activity created successfully.",
                activity: {
                    id: result.insertedId.toString(),
                    ...activity,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating activity:", error);

        return NextResponse.json(
            {
                error: "Unable to create activity.",
            },
            { status: 500 },
        );
    }
}