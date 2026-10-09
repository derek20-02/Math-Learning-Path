import type { ActivityProgress } from "@/lib/types";
import Link from "next/link";

type ActivitiesCardProps = {
  activity: ActivityProgress;
};

/**
 * Displays an activity and its aggregate progress across student assignments.
 */
export default function ActivitiesCard({ activity }: ActivitiesCardProps) {
  return (
    <Link href={`/activities/${activity.id}`}>
      <article className="flex h-full flex-col gap-5 rounded-xl activity-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm text-[var(--secondaryText)]">
              {activity.assignedStudents.length
                ? `Assigned to: ${activity.assignedStudents.join(", ")}`
                : "No students assigned"}
            </p>
            <p className="text-sm font-medium text-[var(--secondaryText)]">
              {activity.difficulty}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--primaryText)]">
              {activity.objective}
            </h2>
          </div>
          <span className="shrink-0 rounded-full border border-[var(--borders)] px-3 py-1 text-xs font-medium text-[var(--primaryText)]">
            {activity.assignmentCount} assignments
          </span>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-[var(--primaryText)]">
          {activity.description}
        </p>

        <div className="mt-auto border-t border-[var(--borders)] pt-4">
          <div className="flex items-center justify-between text-sm text-[var(--primaryText)]">
            <span>
              {activity.completedCount} of {activity.totalCount} assigned
              exercises completed
            </span>
            <span>{activity.progressPercent}%</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--background)]"
            role="progressbar"
            aria-label={`${activity.objective} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={activity.progressPercent}
          >
            <div
              className="h-full rounded-full bg-[var(--successMsg)] transition-[width]"
              style={{ width: `${activity.progressPercent}%` }}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
