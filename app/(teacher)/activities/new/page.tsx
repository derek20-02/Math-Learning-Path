import ActivityForm from "@/app/components/activities/activity-form";

export default function NewActivityPage() {
    return (
        <main className="min-h-screen bg-[#F5F9FC]">
            <header className="bg-[#61A8DF] px-6 py-8">
                <div className="mx-auto max-w-2xl">
                    <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-white/80">
                        Trayectoria Matemática
                    </p>

                    <h1 className="text-3xl font-bold text-white">
                        Create Learning Activity
                    </h1>
                </div>
            </header>

            <section className="mx-auto max-w-2xl px-6 py-10">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-[#1E293B]">
                        Activity Information
                    </h2>

                    <p className="mt-2 text-[#64748B]">
                        Create a mathematics learning activity by entering its objective,
                        description, and difficulty.
                    </p>
                </div>

                <ActivityForm />
            </section>
        </main>
    );
}