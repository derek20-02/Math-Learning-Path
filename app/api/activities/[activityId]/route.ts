import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/authorization";

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

interface AuthenticatedUser {
    id?: string;
    role?: string;
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
 * Updates a learning activity owned by the authenticated teacher.
 */
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ activityId: string }> },
) {
    try {
        // Verify authentication.
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 },
            );
        }

        const authenticatedUser = user as AuthenticatedUser;

        // Only teachers can edit activities.
        if (authenticatedUser.role !== "teacher") {
            return NextResponse.json(
                { error: "Forbidden: teacher access required." },
                { status: 403 },
            );
        }

        if (!authenticatedUser.id) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 },
            );
        }

        const { activityId } = await context.params;

        // Validate MongoDB ObjectId.
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

        // At least one editable field must be provided.
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

        // Validate objective.
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

        // Validate description.
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

        // Validate difficulty.
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

        if (
            difficulty !== undefined &&
            isValidDifficulty(difficulty)
        ) {
            updates.difficulty = difficulty;
        }

        const db = await getDb();
        const collection = db.collection(COLLECTION_NAME);
        const objectId = new ObjectId(activityId);

        // Confirm that the activity exists.
        const existingActivity = await collection.findOne({
            _id: objectId,
        });

        if (!existingActivity) {
            return NextResponse.json(
                { error: "Activity not found." },
                { status: 404 },
            );
        }

        // Verify that the authenticated teacher owns the activity.
        if (existingActivity.teacherId !== authenticatedUser.id) {
            return NextResponse.json(
                {
                    error: "Forbidden: you do not own this activity.",
                },
                { status: 403 },
            );
        }

        const updatedAt = new Date();

        // Include teacherId in the database filter as an additional
        // ownership safeguard.
        await collection.updateOne(
            {
                _id: objectId,
                teacherId: authenticatedUser.id,
            },
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