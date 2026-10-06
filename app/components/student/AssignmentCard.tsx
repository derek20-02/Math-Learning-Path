import Link from "next/link";
import type { Activity } from "@/types/activity.types";
import type { Assigment } from "@/types/assigment.types";


type AssignmentWithActivity = Omit<Assigment, "_id"> & {
  _id: string;
  activity: Activity | null;
};

type AssignmentCardProps = {
  assignments: AssignmentWithActivity[];
};

function getStatusLabel(status: string) {
  switch (status) {
    case "completed":
      return "Completada";
    case "in_progress":
      return "En progreso";
    case "pending":
      return "Pendiente";
    default:
      return status;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default function AssignmentCard({
  assignments,
}: AssignmentCardProps) {
  if (assignments.length === 0) {
    return (
      <div className="mx-auto my-4 w-[calc(100%-2rem)] max-w-3xl rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
        <p>No tienes actividades asignadas por el momento.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-4 grid w-[calc(100%-2rem)] max-w-3xl gap-4 sm:my-6">
      {assignments.map((assignment) => (
        <Link
          key={assignment._id}
          href={`/learning-path/${assignment._id}`}
          className="block rounded-lg border border-gray-300 p-4 transition-colors hover:bg-gray-100 sm:p-6"
        >
          {assignment.activity ? (
            <>
              <h2 className="text-lg font-semibold">
                {assignment.activity.title}
              </h2>

              <p className="mt-2 text-gray-700">
                {assignment.activity.description}
              </p>

              <p className="mt-2">
                <strong>Objetivo:</strong> {assignment.activity.objective}
              </p>

              <p className="mt-2">
                <strong>Dificultad:</strong> {assignment.activity.difficulty}
              </p>
            </>
          ) : (
            <h2 className="text-lg font-semibold">
              Actividad no disponible
            </h2>
          )}

          <dl className="mt-4 space-y-1 text-sm text-gray-600">
            <div>
              <dt className="inline font-semibold">Estado: </dt>
              <dd className="inline">{getStatusLabel(assignment.status)}</dd>
            </div>

            <div>
              <dt className="inline font-semibold">Asignada: </dt>
              <dd className="inline">{formatDate(assignment.assignedAt)}</dd>
            </div>

            <div>
              <dt className="inline font-semibold">Fecha límite: </dt>
              <dd className="inline">{formatDate(assignment.dueAt)}</dd>
            </div>
          </dl>
        </Link>
      ))}
    </div>
  );
}