import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/authorization";

import {
    ACTIVITY_DIFFICULTIES,
    ActivityDifficulty,
    CreateLearningActivityInput,
} from "@/db/schema/learning-activity";

import { getDb } from "@/lib/mongodb";
import {
  requireRole,
  teacherActivityOwnershipFilter,
} from "@/lib/auth/authorization";

const idString = (id: unknown) => String(id);

export async function GET() {
  try {
    const authorization = await requireRole("teacher");
    if ("response" in authorization) return authorization.response;

    // Connect to the database and fetch the collections we need for activities,
    // exercises, assignments, and student submissions.
    const db = await getDb();
    const activitiesCollection = db.collection("learning_Activity");
    const exercisesCollection = db.collection("exercise");
    const assignmentsCollection = db.collection("assignment");
    const submissionsCollection = db.collection("submission");

    // Limit the list to this teacher's activities before loading progress data.
    const activities = await activitiesCollection
      .find(teacherActivityOwnershipFilter(authorization.user.id))
      .toArray();

    // Fetch exercises and assignments only for those owned activities.
    const activityIds = activities.map((activity) => activity._id);
    const [exercises, assignments] = await Promise.all([
      exercisesCollection.find({ activityId: { $in: activityIds } }).toArray(),
      assignmentsCollection
        .find({ activityId: { $in: activityIds } })
        .toArray(),
    ]);

    // Build a unique list of student IDs referenced by assignments so we can
    // fetch their names in one query rather than repeatedly looking up each user.
    const studentIds = [
      ...new Map(
        assignments
          .filter((assignment) => assignment.studentId)
          .map((assignment) => [
            idString(assignment.studentId),
            assignment.studentId,
          ]),
      ).values(),
    ];

    // Fetch only the user names needed for assigned students.
    const students = studentIds.length
      ? await db
          .collection("user")
          .find({ _id: { $in: studentIds } }, { projection: { name: 1 } })
          .toArray()
      : [];

    // Map each student ID to a display name. If a user is missing a name,
    // fall back to their raw ID string so the UI still has a readable value.
    const studentNamesById = new Map(
      students.map((student) => [
        idString(student._id),
        typeof student.name === "string" && student.name.trim()
          ? student.name
          : idString(student._id),
      ]),
    );

    // Load submissions only for the assignments that belong to these activities.
    const assignmentIds = assignments.map((assignment) => assignment._id);
    const submissions = assignmentIds.length
      ? await submissionsCollection
          .find({ assignmentId: { $in: assignmentIds } })
          .toArray()
      : [];

    // Build the response: each activity with its exercises and assigned students.
    const result = activities.map((activity) => {
      const activityKey = idString(activity._id);

      const activityAssignments = assignments.filter(
        (assignment) => idString(assignment.activityId) === activityKey,
      );
      const activityExercises = exercises.filter(
        (exercise) => idString(exercise.activityId) === activityKey,
      );
      const activeExerciseIds = new Set(
        activityExercises
          .filter((exercise) => exercise.isActive !== false)
          .map((exercise) => idString(exercise._id)),
      );
      const activityAssignmentIds = new Set(
        activityAssignments.map((assignment) => idString(assignment._id)),
      );
      const completedExerciseAssignments = new Set(
        submissions
          .filter(
            (submission) =>
              activityAssignmentIds.has(idString(submission.assignmentId)) &&
              activeExerciseIds.has(idString(submission.exerciseId)) &&
              ["submitted", "graded"].includes(submission.status),
          )
          .map(
            (submission) =>
              `${idString(submission.assignmentId)}:${idString(submission.exerciseId)}`,
          ),
      );
      const totalCount = activeExerciseIds.size * activityAssignments.length;
      const completedCount = completedExerciseAssignments.size;

      return {
        ...activity,
        _id: activityKey,
        id: activityKey,
        objective: activity.objective ?? activity.title ?? "Untitled activity",
        exerciseCount: activeExerciseIds.size,
        assignedStudents: [
          ...new Set(
            activityAssignments.map(
              (assignment) =>
                studentNamesById.get(idString(assignment.studentId)) ??
                idString(assignment.studentId),
            ),
          ),
        ],
        assignmentCount: activityAssignments.length,
        completedCount,
        totalCount,
        progressPercent: totalCount
          ? Math.round((completedCount / totalCount) * 100)
          : 0,
        exercises: activityExercises,
        assignments: activityAssignments.map((assignment) => ({
          ...assignment,
          _id: idString(assignment._id),
          studentName:
            studentNamesById.get(idString(assignment.studentId)) ?? null,
          submissions: submissions.filter(
            (submission) =>
              idString(submission.assignmentId) === idString(assignment._id),
          ),
        })),
      };
    });

    return NextResponse.json({ activities: result });
  } catch (error) {
    console.error("Error fetching teacher activities:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar las actividades." },
      { status: 500 },
    );
  }
}
const COLLECTION_NAME = "learning_Activity";

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
 * Creates a new learning activity for the authenticated teacher.
 */
export async function POST(request: NextRequest) {
    try {
        // Verify that the user is authenticated.
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 },
            );
        }

        const authenticatedUser = user as {
            id?: string;
            role?: string;
        };

        // Only teachers can create learning activities.
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

        // The authenticated teacher becomes the activity owner.
        const activity = {
            ...activityInput,
            teacherId: authenticatedUser.id,
            status: "draft",
            createdAt: now,
            updatedAt: now,
        };

        const result = await db
            .collection(COLLECTION_NAME)
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
