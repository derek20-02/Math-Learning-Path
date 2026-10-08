import StudentActivities from '@/components/StudentActivities';

export default async function StudentActivityPage() {

	async function getStudentActivities() {
		try {
			const response = await fetch('/api/activities/[studentId]', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch student activities');
			}

			const data = await response.json();
			return data.data.studentActivities;
		} catch (error) {
			console.error("Failed to retrieve student activities:", error);
		}
	}

	return (
		<main className="flex flex-1 flex-col gap-6 p-6 md:p-10">
			<h1 className="text-2xl font-semibold">Activities Dashboard</h1>
			<StudentActivities />
		</main>
	);
}
