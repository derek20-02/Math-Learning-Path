
import { Activity } from "@/types/activity.types";

export default async function ActivitiesCard({ activity }: { activity: Activity }) {

    return (
        <div className="mx-auto my-4 w-[calc(100%-2rem)] max-w-3xl space-y-4 break-words rounded-lg   p-4 sm:my-6 sm:space-y-6 sm:p-6 lg:p-8">
            {!activity ? (
                <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg my-4">
                    <p>No hay actividades disponibles</p>
                </div>
            ) : (
               
                    <div key={activity._id} className="p-4 border border-gray-300 rounded-lg">
                        <h3 className="text-lg font-semibold">{activity.title}</h3>
                        <p>_ID: {activity._id}</p>
                        <ul>
                           <li><strong>Descripción:</strong> {activity.description}</li>
                        <li><strong>Objetivo:</strong> {activity.objective}</li>
                        <li><strong>Creado:</strong> {activity.createdAt}</li>
                    </ul>
                    </div>               
            )}
        </div>
    );
}