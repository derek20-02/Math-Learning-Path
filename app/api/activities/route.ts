import { getDb } from "@/lib/mongodb";

const idString = (id: unknown) => String(id);

export async function GET() {
  try {
    const db = await getDb();
    const activitiesCollection = db.collection("learning_Activity");
    const exercisesCollection = db.collection("exercise");
    const assignmentsCollection = db.collection("assignment");
    const submissionsCollection = db.collection("submission");

    const [activities, exercises, assignments] = await Promise.all([
      activitiesCollection.find({}).toArray(),
      exercisesCollection.find({}).toArray(),
      assignmentsCollection.find({}).toArray(),
    ]);

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
    const students = studentIds.length
      ? await db
          .collection("user")
          .find({ _id: { $in: studentIds } }, { projection: { name: 1 } })
          .toArray()
      : [];
    const studentNamesById = new Map(
      students.map((student) => [
        idString(student._id),
        typeof student.name === "string" && student.name.trim()
          ? student.name
          : idString(student._id),
      ]),
    );

    const exerciseIds = exercises.map((exercise) => exercise._id);
    const submissions = exerciseIds.length
      ? await submissionsCollection
          .find({
            exerciseId: { $in: exerciseIds },
            status: { $in: ["submitted", "graded"] },
          })
          .toArray()
      : [];

    const data = activities.map((activity) => {
      const activityId = idString(activity._id);
      const activityExercises = exercises.filter(
        (exercise) =>
          idString(exercise.activityId) === activityId &&
          exercise.isActive !== false,
      );
      const activityExerciseIds = new Set(
        activityExercises.map((exercise) => idString(exercise._id)),
      );
      const activityAssignments = assignments.filter(
        (assignment) => idString(assignment.activityId) === activityId,
      );
      const assignedStudentIds = new Set(
        activityAssignments
          .filter((assignment) => assignment.studentId)
          .map((assignment) => idString(assignment.studentId)),
      );
      const assignedStudents = [...assignedStudentIds].map(
        (studentId) => studentNamesById.get(studentId) ?? studentId,
      );
      const assignmentsById = new Map(
        activityAssignments.map((assignment) => [
          idString(assignment._id),
          assignment,
        ]),
      );
      const completedPairs = new Set<string>();

      for (const submission of submissions) {
        const assignmentId = idString(submission.assignmentId);
        const exerciseId = idString(submission.exerciseId);
        const assignment = assignmentsById.get(assignmentId);

        if (!assignment || !activityExerciseIds.has(exerciseId)) continue;
        if (
          assignment.studentId &&
          submission.studentId &&
          idString(assignment.studentId) !== idString(submission.studentId)
        ) {
          continue;
        }

        completedPairs.add(`${assignmentId}:${exerciseId}`);
      }

      const totalCount = activityExercises.length * activityAssignments.length;
      const completedCount = completedPairs.size;
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

    return Response.json({
      message: "Activities and progress retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Failed to retrieve activities and progress:", error);
    return Response.json(
      { message: "Error retrieving activities and progress" },
      { status: 500 },
    );
  }
}
