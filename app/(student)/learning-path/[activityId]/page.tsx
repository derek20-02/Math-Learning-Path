import { notFound } from "next/navigation";
import AssigmentCardDetails from "@/app/components/student/AssigmentCardDetails";
import { getActivityById } from "@/app/controllers/ActivityController";
import { getAssigmentById } from "@/app/controllers/AssigmentController";

export default async function Page({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const { activityId: assignmentId } = await params;

  const assignmentResponse = await getAssigmentById(assignmentId);

  if (!assignmentResponse.ok) {
    notFound();
  }

  const assignment = await assignmentResponse.json();

  const activityResponse = await getActivityById(assignment.activityId);

  if (!activityResponse.ok) {
    notFound();
  }

  const activity = await activityResponse.json();

  return (
    <AssigmentCardDetails
      assigment={assignment}
      activity={activity}
    />
  );
}