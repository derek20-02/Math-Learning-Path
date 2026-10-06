import AssignmentCard from "@/app/components/student/AssignmentCard";
import { getActivityById } from "@/app/controllers/ActivityController";
import { getAssigmentByStudentId } from "@/app/controllers/AssigmentController";
import type { Activity } from "@/types/activity.types";
import type { Assigment } from "@/types/assigment.types";

type AssignmentWithActivity = Assigment & {
  activity: Activity | null;
};

export default async function Page() {
  // ID provisional para pruebas. Después debe salir de la sesión.
  const studentId = "66f000000000000000000003";

  const assignmentsResponse = await getAssigmentByStudentId(studentId);

  if (!assignmentsResponse.ok) {
    throw new Error("No se pudieron cargar las asignaciones del estudiante");
  }

  const assignments: Assigment[] = await assignmentsResponse.json();

  const assignmentsWithActivity: AssignmentWithActivity[] = await Promise.all(
    assignments.map(async (assignment) => {
      const activityResponse = await getActivityById(assignment.activityId);

      if (!activityResponse.ok) {
        return {
          ...assignment,
          activity: null,
        };
      }

      const activity: Activity = await activityResponse.json();

      return {
        ...assignment,
        activity,
      };
    })
  );

  return <AssignmentCard assignments={assignmentsWithActivity} />;
}