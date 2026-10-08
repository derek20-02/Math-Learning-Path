import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    // Makes the connection to the exercise collection.
    const db = await getDb();
    const { studentId } = await sessionStorage.getSession().get("user") || {};
    if (!ObjectId.isValid(studentId)) {
      return Response.json({ message: "Invalid student ID" }, { status: 400 });
    }

    const studentActivitiesCollection = db.collection("learning_Activity");

    // Load the full catalog of activities for the student.
    const studentActivities = await studentActivitiesCollection
      .find({ studentId: new ObjectId(studentId) })
      .toArray();

    // Return the activities as a JSON response
    return Response.json({
      message: "Student activities retrieved successfully",
      status: 200,
      data: {
        studentActivities,
      },
    });

  } catch (error) {
    console.error("Failed to retrieve activities:", error);
    return Response.json(
      {
        message: "Error retrieving activities",
        status: 500,
      },
      { status: 500 },
    );
  }
}
