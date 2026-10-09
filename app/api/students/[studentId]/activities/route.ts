import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authorizeRole } from "@/lib/auth/authorization";

const idString = (id: unknown) => String(id);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> },
) {
  try {
    const authorization = await authorizeRole("student");
    if ("response" in authorization) return authorization.response;

    const { studentId } = await params;
    if (!ObjectId.isValid(studentId)) {
      return Response.json({ message: "Invalid student ID" }, { status: 400 });
    }
    if (studentId !== authorization.user.id) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const db = await getDb();
    const studentObjectId = new ObjectId(studentId);
    const [assignments, student] = await Promise.all([
      db
        .collection("assignment")
        .find({ studentId: studentObjectId })
        .toArray(),
      db
        .collection("user")
        .findOne({ _id: studentObjectId }, { projection: { name: 1 } }),
    ]);

    const activityIds = assignments.map((assignment) => assignment.activityId);
    const [activities, allExercises] = activityIds.length
      ? await Promise.all([
          db
            .collection("learning_Activity")
            .find({ _id: { $in: activityIds } })
            .toArray(),
          db
            .collection("exercise")
            .find({ activityId: { $in: activityIds } })
            .toArray(),
        ])
      : [[], []];

    const activeExercises = allExercises.filter(
      (exercise) => exercise.isActive !== false,
    );
    const exerciseIds = activeExercises.map((exercise) => exercise._id);
    const assignmentIds = assignments.map((assignment) => assignment._id);
    const submissions =
      exerciseIds.length && assignmentIds.length
        ? await db
            .collection("submission")
            .find({
              exerciseId: { $in: exerciseIds },
              assignmentId: { $in: assignmentIds },
              studentId: studentObjectId,
              status: { $in: ["submitted", "graded"] },
            })
            .toArray()
        : [];

    const completedPairs = new Set(
      submissions.map(
        (submission) =>
          `${idString(submission.assignmentId)}:${idString(submission.exerciseId)}`,
      ),
    );

    const data = activities.map((activity) => {
      const activityId = idString(activity._id);
      const assignment = assignments.find(
        (item) => idString(item.activityId) === activityId,
      );
      const activityExercises = activeExercises.filter(
        (exercise) => idString(exercise.activityId) === activityId,
      );
      const completedCount = assignment
        ? activityExercises.filter((exercise) =>
            completedPairs.has(
              `${idString(assignment._id)}:${idString(exercise._id)}`,
            ),
          ).length
        : 0;
      const totalCount = activityExercises.length;
      const { _id: activityObjectId, ...activityFields } = activity;

      return {
        ...activityFields,
        id: idString(activityObjectId),
        objective: activity.objective ?? activity.title ?? "Untitled activity",
        exerciseCount: totalCount,
        assignmentCount: assignment ? 1 : 0,
        assignedStudents: [student?.name ?? studentId],
        completedCount,
        totalCount,
        progressPercent: totalCount
          ? Math.round((completedCount / totalCount) * 100)
          : 0,
      };
    });

    return Response.json({
      message: "Student activities retrieved successfully",
      data: { studentActivities: data },
    });
  } catch (error) {
    console.error("Failed to retrieve student activities:", error);
    return Response.json(
      { message: "Error retrieving student activities" },
      { status: 500 },
    );
  }
}
