import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> },
) {
  try {
    const db = await getDb();
    const { activityId } = await params;
    const exercisesCollection = db.collection("learning_Activity");

    const exercises = await exercisesCollection
      .find({ _id: new ObjectId(activityId) })
      .toArray();

    return Response.json({
      message: "Exercises retrieved successfully",
      status: 200,
      data: exercises,
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
