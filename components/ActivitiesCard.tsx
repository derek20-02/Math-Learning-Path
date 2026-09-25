import type { StudentActivity } from "@/lib/types";

type ActivitiesCardProps = {
    activity: StudentActivity;
};

const statusLabels: Record<StudentActivity["status"], string> = {
    "not-started": "Not started",
    "in-progress": "In progress",
    completed: "Completed",
};

const difficultyLabels: Record<StudentActivity["difficulty"], string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
};

/**
 * Displays the learner-facing summary for one activity.
 * The activity's status and exercise counts are converted into readable labels
 * and a percentage so the card can show both progress text and a progress bar.
 */
export default function ActivitiesCard({ activity }: ActivitiesCardProps) {
    // Avoid division by zero for activities that do not contain exercises yet.
    const progress = activity.exerciseCount
        ? Math.round((activity.completedExercises / activity.exerciseCount) * 100)
        : 0;

    return (
        <article className="flex h-full flex-col gap-5 rounded-xl activity-card p-6 shadow-sm">
            {/* The header identifies the activity and shows its current status. */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[var(--secondaryText)]">
                        {difficultyLabels[activity.difficulty]}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-[var(--primaryText)]">
                        {activity.objective}
                    </h2>
                </div>
                <span className="shrink-0 rounded-full border border-[var(--borders)] px-3 py-1 text-xs font-medium text-[var(--primaryText)]">
                    {statusLabels[activity.status]}
                </span>
            </div>

            <p className="line-clamp-3 text-sm leading-6 text-[var(--primaryText)]">
                {activity.description}
            </p>

            {/* The footer gives learners an exact count and a visual progress indicator. */}
            <div className="mt-auto border-t border-[var(--borders)] pt-4">
                <div className="flex items-center justify-between text-sm text-[var(--primaryText)]">
                    <span>
                        {activity.completedExercises} of {activity.exerciseCount} exercises
                    </span>
                    <span>{progress}%</span>
                </div>
                <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--background)]"
                    role="progressbar"
                    aria-label={`${activity.objective} progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                >
                    <div
                        className="h-full rounded-full bg-[var(--successMsg)] transition-[width]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </article>
    );
}