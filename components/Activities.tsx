import { activities } from "@/lib/data/activities";
import ActivitiesCard from "./ActivitiesCard";

export default function Activities() {
    return (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Map the activities and create one card for each record. */}
            {activities.map((activity) => (
                <ActivitiesCard key={activity.id} activity={activity} />
            ))}
        </section>
    );
}