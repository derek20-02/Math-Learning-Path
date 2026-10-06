import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const idString = (id: unknown) => String(id);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> },
) {
  try {
    // Makes the connection to the exercise collection.
    const db = await getDb();
    const { activityId } = await params;
    if (!ObjectId.isValid(activityId)) {
      return Response.json({ message: "Invalid activity ID" }, { status: 400 });
    }

    const exercisesCollection = db.collection("exercise");
    const submissionsCollection = db.collection("submission");

    // Load the full catalog so the dialog can show assigned and unassigned exercises.
    const exerciseOptions = await exercisesCollection.find({}).toArray();
    const exercises = exerciseOptions.filter(
      (exercise) =>
        idString(exercise.activityId) === activityId &&
        exercise.isActive !== false,
    );

    // Submissions reference exercises, so query using the exercise IDs.
    const exerciseIds = exercises.map((exercise) => exercise._id);
    const submissions = exerciseIds.length
      ? await submissionsCollection
          .find({
            exerciseId: {
              $in: [
                ...exerciseIds,
                ...exerciseIds.map((exerciseId) => exerciseId.toString()),
              ],
            },
          })
          .toArray()
      : [];

    // Return the exercises and submissions as a JSON response
    return Response.json({
      message: "Exercises and submissions retrieved successfully",
      status: 200,
      data: {
        exercises,
        submissions,
        // Normalize the assignment reference for comparison in the client.
        exerciseOptions: exerciseOptions.map((exercise) => ({
          ...exercise,
          isActive: exercise.isActive !== false,
          assignedActivityId: exercise.activityId
            ? idString(exercise.activityId)
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to retrieve activity exercises:", error);
    return Response.json(
      {
        message: "Error retrieving exercises",
        status: 500,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> },
) {
  try {
    const db = await getDb();
    const { activityId } = await params;
    const { exerciseId, action } = (await request.json()) as {
      exerciseId?: string;
      action?: "assign" | "deactivate" | "activate";
    };

    if (
      !ObjectId.isValid(activityId) ||
      !exerciseId ||
      !ObjectId.isValid(exerciseId) ||
      (action !== "assign" && action !== "deactivate" && action !== "activate")
    ) {
      return Response.json({ message: "Invalid request" }, { status: 400 });
    }

    // Accept only unassigned exercises or ones already linked to this activity.
    const exercisesCollection = db.collection("exercise");
    const exerciseObjectId = new ObjectId(exerciseId);
    const activityObjectId = new ObjectId(activityId);

    let result;
    if (action === "assign") {
      result = await exercisesCollection.updateOne(
        {
          _id: exerciseObjectId,
          $or: [
            { activityId: activityObjectId },
            { activityId },
            { activityId: null },
            { activityId: { $exists: false } },
          ],
        },
        { $set: { activityId: activityObjectId, isActive: true } },
      );
    } else {
      result = await exercisesCollection.updateOne(
        {
          _id: exerciseObjectId,
          $or: [{ activityId: activityObjectId }, { activityId }],
        },
        { $set: { isActive: action === "activate" } },
      );
    }

    if (!result.matchedCount) {
      // A missing match means the exercise does not exist or belongs elsewhere.
      return Response.json(
        { message: "Exercise not found or assigned to another activity" },
        { status: 409 },
      );
    }

    const actionMessages = {
      assign: "assigned",
      deactivate: "deactivated",
      activate: "reactivated",
    };

    return Response.json({
      message: `Exercise ${actionMessages[action]} successfully`,
    });
  } catch (error) {
    console.error("Failed to update exercise assignment:", error);
    return Response.json(
      { message: "Error updating exercise assignment" },
      { status: 500 },
    );
  }
}
