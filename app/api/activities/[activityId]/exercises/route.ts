import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> },
) {
  try {
    // Makes the connection to the excercise colletion
    const db = await getDb();
    const { activityId } = await params;
    const exercisesCollection = db.collection("exercise");
    const submissionsCollection = db.collection("submission");

    // Find all exercises associated with the given activity ID
    const exercises = await exercisesCollection
      .find({ activityId: new ObjectId(activityId) })
      .toArray();

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
      },
    });
  } catch (error) {
    return Response.json(
      {
        message: "Error retrieving exercises",
        status: 500,
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  const db = await getDb();
  const exercisesCollection = db.collection("learning_Activity");

  // Insert a new exercise document into the collection
}
