import Link from "next/link";
import type { ActivityProgress } from "@/lib/types";

type StudentActivitiesProps = {
    studentActivities?: ActivityProgress[];
};

export default function StudentActivities({
    studentActivities = [],
}: StudentActivitiesProps) {

    return (
        <>
        <Link href="/(student)/learning-path" className="text-blue-500 hover:underline">
            Back to Learning Path
        </Link>
        {studentActivities.map((activity) => (
            <Link href={`/(student)/learning-path/${activity.id}`} className="" key={activity.id}>
                <article className="flex h-full flex-col gap-5 rounded-xl activity-card p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                    <div>
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
            ))}
        
        </>
    );
}