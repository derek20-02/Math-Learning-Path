import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const idString = (id: unknown) => String(id);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> },
) {
  try {
    const { activityId } = await params;
    if (!ObjectId.isValid(activityId)) {
      return Response.json({ message: "Invalid activity ID" }, { status: 400 });
    }

    const db = await getDb();
    const activityObjectId = new ObjectId(activityId);
    // Load the activity, available student accounts, and existing assignments together.
    const [activity, students, assignments] = await Promise.all([
      db.collection("learning_Activity").findOne({ _id: activityObjectId }),
      db
        .collection("user")
        .find({ role: "student" }, { projection: { name: 1, email: 1 } })
        .sort({ name: 1 })
        .toArray(),
      db
        .collection("assignment")
        .find({ activityId: activityObjectId })
        .toArray(),
    ]);

    if (!activity) {
      return Response.json({ message: "Activity not found" }, { status: 404 });
    }

    // Join assignment student IDs to names for the activity manager UI.
    const studentsById = new Map(
      students.map((student) => [idString(student._id), student]),
    );
    const data = {
      students: students.map((student) => ({
        id: idString(student._id),
        name: student.name ?? "Unnamed student",
        email: student.email ?? "",
      })),
      assignments: assignments.map((assignment) => {
        const studentId = idString(assignment.studentId);
        const student = studentsById.get(studentId);

        return {
          id: idString(assignment._id),
          studentId,
          studentName: student?.name ?? `Student ${studentId.slice(-6)}`,
          email: student?.email ?? "",
          status: assignment.status ?? "in_progress",
          assignedAt:
            assignment.assignedAt instanceof Date
              ? assignment.assignedAt.toISOString()
              : String(assignment.assignedAt ?? ""),
        };
      }),
    };

    return Response.json({ data });
  } catch (error) {
    console.error("Failed to load activity assignments:", error);
    return Response.json(
      { message: "Could not load students for this activity." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> },
) {
  try {
    const { activityId } = await params;
    const { studentId } = (await request.json()) as { studentId?: string };

    if (
      !ObjectId.isValid(activityId) ||
      !studentId ||
      !ObjectId.isValid(studentId)
    ) {
      return Response.json(
        { message: "Invalid assignment request" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const activityObjectId = new ObjectId(activityId);
    const studentObjectId = new ObjectId(studentId);
    // Validate both references and check for an existing activity/student pair.
    const [activity, student, existingAssignment] = await Promise.all([
      db.collection("learning_Activity").findOne({ _id: activityObjectId }),
      db.collection("user").findOne({
        _id: studentObjectId,
        role: "student",
      }),
      db.collection("assignment").findOne({
        activityId: activityObjectId,
        studentId: studentObjectId,
      }),
    ]);

    if (!activity) {
      return Response.json({ message: "Activity not found" }, { status: 404 });
    }
    if (!student) {
      return Response.json({ message: "Student not found" }, { status: 404 });
    }
    if (existingAssignment) {
      return Response.json(
        { message: "This student is already assigned to this activity" },
        { status: 409 },
      );
    }

    const assignedAt = new Date();
    const assignment = {
      activityId: activityObjectId,
      studentId: studentObjectId,
      status: "in_progress",
      assignedAt,
    };
    // Store assignments as separate relationship records, allowing multiple students per activity.
    const { insertedId } = await db
      .collection("assignment")
      .insertOne(assignment);

    return Response.json(
      {
        message: "Student assigned successfully",
        data: {
          assignment: {
            id: insertedId.toString(),
            studentId,
            studentName: student.name ?? "Unnamed student",
            email: student.email ?? "",
            status: assignment.status,
            assignedAt: assignedAt.toISOString(),
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to assign student to activity:", error);
    return Response.json(
      { message: "Could not assign this student to the activity." },
      { status: 500 },
    );
  }
}
