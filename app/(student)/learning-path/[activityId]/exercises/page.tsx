export default async function StudentExercisesPage({
	params,
}: {
	params: Promise<{ activityId: string }>;
}) {
	const { activityId } = await params;

	return (
		<main className="flex flex-1 flex-col gap-6 p-6 md:p-10">
			<h1 className="text-2xl font-semibold">Exercises</h1>
			<p>Activity: {activityId}</p>
		</main>
	);
}
