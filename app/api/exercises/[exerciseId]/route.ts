import { ObjectId } from "mongodb";

import { getDb } from "@/lib/mongodb";
import {
  requireRole,
  teacherActivityOwnershipFilter,
} from "@/lib/auth/authorization";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ exerciseId: string }> },
) {
  try {
    const authorization = await requireRole("teacher");
    if ("response" in authorization) return authorization.response;

    const { exerciseId } = await params;
    if (!ObjectId.isValid(exerciseId)) {
      return Response.json({ message: "Invalid exercise ID" }, { status: 400 });
    }

    const db = await getDb();
    const exerciseObjectId = new ObjectId(exerciseId);
    const exercise = await db
      .collection("exercise")
      .findOne({ _id: exerciseObjectId }, { projection: { activityId: 1 } });

    if (!exercise) {
      return Response.json({ message: "Exercise not found" }, { status: 404 });
    }

    if (!exercise.activityId || !ObjectId.isValid(String(exercise.activityId))) {
      return Response.json(
        { message: "Exercise is not linked to an activity you can manage" },
        { status: 404 },
      );
    }

    const activity = await db.collection("learning_Activity").findOne({
      _id: new ObjectId(String(exercise.activityId)),
      ...teacherActivityOwnershipFilter(authorization.user.id),
    });

    if (!activity) {
      return Response.json(
        { message: "Exercise not found" },
        { status: 404 },
      );
    }

    const exerciseIdValues = [exerciseObjectId, exerciseId];
    const existingSubmission = await db.collection("submission").findOne(
      { exerciseId: { $in: exerciseIdValues } },
      { projection: { _id: 1 } },
    );

    if (existingSubmission) {
      return Response.json(
        {
          message:
            "Exercise has submissions and cannot be deleted. Deactivate it to preserve student history.",
        },
        { status: 409 },
      );
    }

    const result = await db.collection("exercise").deleteOne({
      _id: exerciseObjectId,
      activityId: exercise.activityId,
    });

    if (result.deletedCount !== 1) {
      return Response.json({ message: "Exercise not found" }, { status: 404 });
    }

    return Response.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error("Failed to delete exercise:", error);
    return Response.json(
      { message: "Error deleting exercise" },
      { status: 500 },
    );
  }
}
