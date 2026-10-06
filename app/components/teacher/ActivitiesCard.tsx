import { Activity } from "@/types/activity.types";
import Link from "next/link";

export default function ActivitiesCard({ activities }: { activities: Activity[] }) {
    return (
        <div className="mx-auto my-4 w-[calc(100%-2rem)] max-w-3xl space-y-4 break-words rounded-lg p-4 sm:my-2 sm:space-y-2 sm:p-6 lg:p-8">
            {activities.length === 0 ? (
                <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg my-4">
                    <p>No hay actividades disponibles</p>
                </div>
            ) : (
                activities.map((activity) => (
                    <Link key={activity._id} href={`/activities/${activity._id}`}>
                        <div className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors m-2">
                            <h3 className="text-lg font-semibold">{activity.title}</h3>
                            <p>_ID: {activity._id}</p>
                            <ul>
                                <li><strong>Descripción:</strong> {activity.description}</li>
                                <li><strong>Dificultad:</strong> {activity.difficulty}</li>
                                <li><strong>Estado:</strong> {String(activity.status)}</li>
                                <li><strong>TeacherId:</strong> {activity.teacherId}</li>
                            </ul>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
}