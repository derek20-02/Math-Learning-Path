import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function parseNumericAnswer(value: string): number | null {
  const normalized = value.trim();
  const fraction = normalized.match(
    /^([-+]?\d+(?:\.\d+)?)\s*\/\s*([-+]?\d+(?:\.\d+)?)$/,
  );

  if (fraction) {
    const numerator = Number(fraction[1]);
    const denominator = Number(fraction[2]);
    if (!denominator) return null;
    return numerator / denominator;
  }

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ activityId: string; exerciseId: string }>;
  },
) {
  try {
    const { activityId, exerciseId } = await params;
    const { studentId, answer } = (await request.json()) as {
      studentId?: string;
      answer?: string;
    };

    if (
      !ObjectId.isValid(activityId) ||
      !ObjectId.isValid(exerciseId) ||
      !studentId ||
      !ObjectId.isValid(studentId) ||
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      return Response.json({ message: "Invalid submission" }, { status: 400 });
    }

    const db = await getDb();
    const activityObjectId = new ObjectId(activityId);
    const exerciseObjectId = new ObjectId(exerciseId);
    const studentObjectId = new ObjectId(studentId);
    const assignment = await db.collection("assignment").findOne({
      activityId: activityObjectId,
      studentId: studentObjectId,
    });

    if (!assignment) {
      return Response.json(
        { message: "This activity is not assigned to this student" },
        { status: 403 },
      );
    }

    // Accept submissions only for active exercises attached to this assigned activity.
    const exercise = await db.collection("exercise").findOne({
      _id: exerciseObjectId,
      activityId: activityObjectId,
      isActive: { $ne: false },
    });

    if (!exercise) {
      return Response.json(
        { message: "Exercise is not active in this activity" },
        { status: 404 },
      );
    }

    const submissionsCollection = db.collection("submission");
    const assignmentIds = [assignment._id, assignment._id.toString()];
    const exerciseIds = [exerciseObjectId, exerciseObjectId.toString()];
    const previousSubmission = await submissionsCollection.findOne({
      exerciseId: { $in: exerciseIds },
      assignmentId: { $in: assignmentIds },
      studentId: { $in: [studentObjectId, studentId] },
    });

    if (previousSubmission) {
      return Response.json(
        { message: "This exercise has already been answered" },
        { status: 409 },
      );
    }

    // Compare numeric answers as values so equivalent fractions grade equally.
    const submittedAnswer = answer.trim();
    const answerRules = exercise.answerRules as {
      type: string;
      expected: string | string[] | boolean;
      tolerance?: number;
    };
    let isCorrect = false;

    if (answerRules.type === "numeric") {
      const actual = parseNumericAnswer(submittedAnswer);
      const expected = parseNumericAnswer(String(answerRules.expected));
      isCorrect =
        actual !== null &&
        expected !== null &&
        Math.abs(actual - expected) <= (answerRules.tolerance ?? 0);
    } else if (Array.isArray(answerRules.expected)) {
      isCorrect = answerRules.expected.some(
        (expected) =>
          String(expected).trim().toLowerCase() ===
          submittedAnswer.toLowerCase(),
      );
    } else {
      isCorrect =
        String(answerRules.expected).trim().toLowerCase() ===
        submittedAnswer.toLowerCase();
    }

    const submittedAt = new Date();
    const submission = {
      exerciseId: exerciseObjectId,
      studentId: studentObjectId,
      assignmentId: assignment._id,
      answer: submittedAnswer,
      attemptNumber: 1,
      isCorrect,
      status: "graded",
      submittedAt,
    };
    // Persist the student's first answer together with its assignment and grading result.
    const { insertedId } = await submissionsCollection.insertOne(submission);

    return Response.json(
      {
        data: {
          submission: {
            ...submission,
            _id: insertedId.toString(),
            exerciseId: exerciseObjectId.toString(),
            studentId: studentObjectId.toString(),
            assignmentId: assignment._id.toString(),
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to submit exercise answer:", error);
    return Response.json(
      { message: "Error saving submission" },
      { status: 500 },
    );
  }
}
