import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

import ActivityEditForm from "@/app/components/activities/activity-edit-form";
import { getDb } from "@/lib/mongodb";
import {
    ACTIVITY_DIFFICULTIES,
    ActivityDifficulty,
} from "@/db/schema/learning-activity";

interface EditActivityPageProps {
    params: Promise<{
        activityId: string;
    }>;
}

const COLLECTION_NAME = "learning_Activity";

function isValidDifficulty(
    value: unknown,
): value is ActivityDifficulty {
    return (
        typeof value === "string" &&
        ACTIVITY_DIFFICULTIES.includes(
            value as ActivityDifficulty,
        )
    );
}

export default async function EditActivityPage({
    params,
}: EditActivityPageProps) {
    const { activityId } = await params;

    // Validate the MongoDB ObjectId before querying the database.
    if (!ObjectId.isValid(activityId)) {
        notFound();
    }

    const db = await getDb();

    const activity = await db
        .collection(COLLECTION_NAME)
        .findOne({
            _id: new ObjectId(activityId),
        });

    if (!activity) {
        notFound();
    }

    const objective =
        typeof activity.objective === "string"
            ? activity.objective
            : "";

    const description =
        typeof activity.description === "string"
            ? activity.description
            : "";

    const difficulty: ActivityDifficulty =
        isValidDifficulty(activity.difficulty)
            ? activity.difficulty
            : "medium";

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
                        Update the objective, description, or difficulty
                        of this learning activity.
                    </p>
                </div>

                <ActivityEditForm
                    activityId={activityId}
                    initialObjective={objective}
                    initialDescription={description}
                    initialDifficulty={difficulty}
                />
            </section>
        </main>
    );
}
