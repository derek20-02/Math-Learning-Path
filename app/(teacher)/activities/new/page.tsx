import ActivityForm from "@/app/components/activities/activity-form";

export default function NewActivityPage() {
    return (
        <main>
            <h1>Create Learning Activity</h1>

            <p>
                Create a mathematics learning activity by entering its objective,
                description, and difficulty.
            </p>

            <ActivityForm />
        </main>
    );
}