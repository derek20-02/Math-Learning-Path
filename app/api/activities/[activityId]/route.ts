import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDb } from "@/lib/mongodb";

import {
    ACTIVITY_DIFFICULTIES,
    ActivityDifficulty,
} from "@/db/schema/learning-activity";

const COLLECTION_NAME = "learning_Activity";

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

/**
 * GET /api/activities/:activityId
 *
 * Returns one learning activity by MongoDB ObjectId.
 */
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ activityId: string }> },
) {
    try {
        const { activityId } = await context.params;

        if (!ObjectId.isValid(activityId)) {
            return NextResponse.json(
                { error: "Invalid activity ID." },
                { status: 400 },
            );
        }

        const db = await getDb();

        const activity = await db
            .collection(COLLECTION_NAME)
            .findOne({
                _id: new ObjectId(activityId),
            });

        if (!activity) {
            return NextResponse.json(
                { error: "Activity not found." },
                { status: 404 },
            );
        }

        return NextResponse.json(activity, { status: 200 });
    } catch (error) {
        console.error("Error retrieving activity:", error);

        return NextResponse.json(
            { error: "Unable to retrieve activity." },
            { status: 500 },
        );
    }
}

/**
 * PATCH /api/activities/:activityId
 *
 * Validates and persists editable activity fields.
 */
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ activityId: string }> },
) {
    try {
        const { activityId } = await context.params;

        if (!ObjectId.isValid(activityId)) {
            return NextResponse.json(
                { error: "Invalid activity ID." },
                { status: 400 },
            );
        }

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
            objective,
            description,
            difficulty,
        } = body as Record<string, unknown>;

        // At least one editable field must be supplied.
        if (
            objective === undefined &&
            description === undefined &&
            difficulty === undefined
        ) {
            return NextResponse.json(
                {
                    error: "At least one activity field must be provided.",
                },
                { status: 400 },
            );
        }

        // Validate objective when supplied.
        if (
            objective !== undefined &&
            (
                typeof objective !== "string" ||
                objective.trim().length < 5
            )
        ) {
            return NextResponse.json(
                {
                    error: "Objective must contain at least 5 characters.",
                },
                { status: 400 },
            );
        }

        // Validate description when supplied.
        if (
            description !== undefined &&
            (
                typeof description !== "string" ||
                description.trim().length < 10
            )
        ) {
            return NextResponse.json(
                {
                    error: "Description must contain at least 10 characters.",
                },
                { status: 400 },
            );
        }

        // Validate difficulty when supplied.
        if (
            difficulty !== undefined &&
            !isValidDifficulty(difficulty)
        ) {
            return NextResponse.json(
                {
                    error: "Difficulty must be easy, medium, or hard.",
                },
                { status: 400 },
            );
        }

        const updates: UpdateActivityInput = {};

        if (typeof objective === "string") {
            updates.objective = objective.trim();
        }

        if (typeof description === "string") {
            updates.description = description.trim();
        }

        if (difficulty !== undefined && isValidDifficulty(difficulty)) {
            updates.difficulty = difficulty;
        }

        const db = await getDb();

        const collection = db.collection(COLLECTION_NAME);

        const objectId = new ObjectId(activityId);

        // Confirm that the activity exists before updating it.
        const existingActivity = await collection.findOne({
            _id: objectId,
        });

        if (!existingActivity) {
            return NextResponse.json(
                { error: "Activity not found." },
                { status: 404 },
            );
        }

        /*
         * TODO AUTHORIZATION:
         *
         * Once the team's authentication implementation is integrated:
         *
         * 1. Get the authenticated user from the session.
         * 2. Reject unauthenticated users.
         * 3. Verify that the user has the teacher role.
         * 4. Verify that existingActivity.teacherId belongs to that teacher.
         */

        const updatedAt = new Date();

        await collection.updateOne(
            { _id: objectId },
            {
                $set: {
                    ...updates,
                    updatedAt,
                },
            },
        );

        const updatedActivity = await collection.findOne({
            _id: objectId,
        });

        return NextResponse.json(
            {
                message: "Activity updated successfully.",
                activity: updatedActivity,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error updating activity:", error);

        return NextResponse.json(
            { error: "Unable to update activity." },
            { status: 500 },
        );
    }
}