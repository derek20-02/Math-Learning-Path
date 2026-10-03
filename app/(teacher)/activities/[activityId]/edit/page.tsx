import ActivityEditForm from "@/app/components/activities/activity-edit-form";

interface EditActivityPageProps {
    params: Promise<{
        activityId: string;
    }>;
}

export default async function EditActivityPage({
    params,
}: EditActivityPageProps) {
    const { activityId } = await params;

    /*
     * Temporary activity data for UI development.
     *
     * This will be replaced with a database query once the shared
     * project database and authentication Foundation are available.
     */
    const activity = {
        id: activityId,
        objective: "Identify patterns in numerical sequences",
        description:
            "Complete numerical sequences using the pattern rule.",
        difficulty: "medium" as const,
    };

    return (
        <main className="min-h-screen bg-[#F5F9FC]">
            <header className="bg-[#61A8DF] px-6 py-8">
                <div className="mx-auto max-w-2xl">
                    <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-white/80">
                        Trayectoria Matemática
                    </p>

                    <h1 className="text-3xl font-bold text-white">
                        Edit Learning Activity
                    </h1>
                </div>
            </header>

            <section className="mx-auto max-w-2xl px-6 py-10">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-[#1E293B]">
                        Activity Information
                    </h2>

                    <p className="mt-2 text-[#64748B]">
                        Update the objective, description, or difficulty of this
                        learning activity.
                    </p>
                </div>

                <ActivityEditForm
                    activityId={activity.id}
                    initialObjective={activity.objective}
                    initialDescription={activity.description}
                    initialDifficulty={activity.difficulty}
                />
            </section>
        </main>
    );
}