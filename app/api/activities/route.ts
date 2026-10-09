import { getDb } from "@/lib/mongodb";
import { requireRole } from "@/lib/auth/authorization";

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

    // Load all relevant records in parallel to reduce round-trip latency.
    const [activities, exercises, assignments] = await Promise.all([
      activitiesCollection.find({}).toArray(),
      exercisesCollection.find({}).toArray(),
      assignmentsCollection.find({}).toArray(),
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

    // Gather all exercise IDs for the current dataset so submissions can be filtered
    // to only the exercises that actually exist in the system.
    const exerciseIds = exercises.map((exercise) => exercise._id);

    // Fetch only submitted/graded submissions for these exercises to compute progress.
    const submissions = exerciseIds.length
      ? await submissionsCollection
          .find({
            exerciseId: { $in: exerciseIds },
            status: { $in: ["submitted", "graded"] },
          })
          .toArray()
      : [];

    // For each activity, calculate how many exercises/assignments exist and how many
    // completed pairs are valid based on the submitted work.
    const data = activities.map((activity) => {
      const activityId = idString(activity._id);

      // Only active exercises belong to this activity.
      const activityExercises = exercises.filter(
        (exercise) =>
          idString(exercise.activityId) === activityId &&
          exercise.isActive !== false,
      );

      // Build a quick lookup for exercise IDs on this activity so we can check
      // whether a submission belongs to a valid exercise without scanning the full list.
      const activityExerciseIds = new Set(
        activityExercises.map((exercise) => idString(exercise._id)),
      );

      // Collect all assignments linked to this activity.
      const activityAssignments = assignments.filter(
        (assignment) => idString(assignment.activityId) === activityId,
      );

      // Determine which students are assigned to this activity.
      const assignedStudentIds = new Set(
        activityAssignments
          .filter((assignment) => assignment.studentId)
          .map((assignment) => idString(assignment.studentId)),
      );

      // Resolve assignment student IDs to names for the response payload.
      const assignedStudents = [...assignedStudentIds].map(
        (studentId) => studentNamesById.get(studentId) ?? studentId,
      );

      // Convenience map for assignments by ID so we can quickly confirm if a submission
      // references a real assignment in this activity.
      const assignmentsById = new Map(
        activityAssignments.map((assignment) => [
          idString(assignment._id),
          assignment,
        ]),
      );

      // Track unique completed assignment/exercise pairs to avoid double counting when
      // multiple submissions exist for the same pair.
      const completedPairs = new Set<string>();

      for (const submission of submissions) {
        const assignmentId = idString(submission.assignmentId);
        const exerciseId = idString(submission.exerciseId);
        const assignment = assignmentsById.get(assignmentId);

        // Ignore submissions for assignments or exercises outside this activity.
        if (!assignment || !activityExerciseIds.has(exerciseId)) continue;

        // If the assignment has a studentId and submission belongs to another student,
        // ignore it so we don't count cross-student progress incorrectly.
        if (
          assignment.studentId &&
          submission.studentId &&
          idString(assignment.studentId) !== idString(submission.studentId)
        ) {
          continue;
        }

        // Record a unique pair of assignment + exercise as complete.
        completedPairs.add(`${assignmentId}:${exerciseId}`);
      }

      // Total possible progress for this activity: exercises × assignments.
      const totalCount = activityExercises.length * activityAssignments.length;
      const completedCount = completedPairs.size;

      // Remove _id from the activity object to avoid exposing Mongo's internal identifier
      // while adding a more UI-friendly id field below.
      const { _id, ...activityFields } = activity;

      return {
        ...activityFields,
        id: activityId,
        exerciseCount: activityExercises.length,
        assignmentCount: activityAssignments.length,
        assignedStudents,
        completedCount,
        totalCount,
        progressPercent: totalCount
          ? Math.round((completedCount / totalCount) * 100)
          : 0,
      };
    });

    // Return the enriched activity list and completion data to the client.
    return Response.json({
      message: "Activities and progress retrieved successfully",
      data,
    });
  } catch (error) {
    // Surface the failure clearly in logs and return a safe 500 response.
    console.error("Failed to retrieve activities and progress:", error);
    return Response.json(
      { message: "Error retrieving activities and progress" },
      { status: 500 },
    );
  }
}
