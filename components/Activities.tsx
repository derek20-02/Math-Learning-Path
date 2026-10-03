import type { ActivityProgress } from "@/lib/types";
import ActivitiesCard from "./ActivitiesCard";

export default function Activities({
  activities,
}: {
  activities: ActivityProgress[];
}) {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {activities.map((activity) => (
        <ActivitiesCard key={activity.id} activity={activity} />
      ))}
    </section>
  );
}
