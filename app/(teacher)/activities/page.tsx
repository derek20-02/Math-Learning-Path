import Activities from "@/components/Activities";

export default function studentsActivities() {
    return (
        <main className="flex flex-1 flex-col gap-8 bg-zinc-50 p-6 md:p-10">
            <header>
                <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                    Learning path
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
                    Activities
                </h1>
            </header>
            <Activities />
        </main>
    );
}