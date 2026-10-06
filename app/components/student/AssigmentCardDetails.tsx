
import type { Activity } from "@/types/activity.types";
import type { Assigment } from "@/types/assigment.types";

type AssigmentCardDetailsProps = {
    assigment: Assigment;
    activity: Activity | null;
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

export default function AssigmentCardDetails({
    assigment,
    activity,
}: AssigmentCardDetailsProps) {
    if (!activity) {
        return (
            <div className="mx-auto my-4 w-[calc(100%-2rem)] max-w-3xl rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                <p>La actividad asignada no está disponible.</p>
            </div>
        );
    }

    return (
        <article className="mx-auto my-4 w-[calc(100%-2rem)] max-w-3xl break-words rounded-lg border border-gray-300 p-4 sm:my-6 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-semibold">{activity.title}</h1>

            <p className="mt-3 text-gray-700">{activity.description}</p>

            <p className="mt-4">
                <strong>Objetivo:</strong> {activity.objective}
            </p>

            <p className="mt-2">
                <strong>Dificultad:</strong> {activity.difficulty}
            </p>

            <dl className="mt-6 space-y-2 text-sm text-gray-600">
                <div>
                    <dt className="inline font-semibold">Estado: </dt>
                    <dd className="inline">{getStatusLabel(assigment.status)}</dd>
                </div>
                <div>
                    <dt className="inline font-semibold">Asignada: </dt>
                    <dd className="inline">{formatDate(assigment.assignedAt)}</dd>
                </div>
                <div>
                    <dt className="inline font-semibold">Fecha límite: </dt>
                    <dd className="inline">{formatDate(assigment.dueAt)}</dd>
                </div>
            </dl>
        </article>
    );
}