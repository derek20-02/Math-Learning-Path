"use client";

import { StudentExercise } from "@/components/Exercise";
import type { Exercise, Submission } from "@/lib/types";
import { getSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Returns all exercises associated with a given activity ID.
export default function ShowExercises() {
  const { activityId } = useParams<{ activityId: string }>();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ignore an older request if the activity changes or the page unmounts.
    let isCurrent = true;

    async function loadExercises() {
      try {
        setLoading(true);
        setError(null);
        const session = await getSession();
        const authenticatedStudentId = (
          session?.user as { id?: unknown } | undefined
        )?.id;
        if (typeof authenticatedStudentId !== "string") {
          throw new Error("Could not identify the signed-in student.");
        }
        if (!isCurrent) return;
        setStudentId(authenticatedStudentId);

        const response = await fetch(
          `/api/activities/${activityId}/exercises?studentId=${encodeURIComponent(authenticatedStudentId)}`,
        );
        if (!response.ok) throw new Error("Could not load activity exercises.");
        const result = await response.json();
        if (!isCurrent) return;

        // The API filters saved answers to this activity assignment and student.
        setExercises(result.data.exercises);
        setSubmissions(result.data.submissions);
      } catch (error) {
        if (isCurrent) {
          setError(
            error instanceof Error
              ? error.message
              : "Could not load activity exercises.",
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    void loadExercises();
    return () => {
      isCurrent = false;
    };
  }, [activityId]);

  return (
    <>
      <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
        {loading ? (
          <p role="status">Loading exercises...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : exercises.length && studentId ? (
          exercises.map((exercise) => (
            <StudentExercise
              key={exercise._id}
              activityId={activityId}
              studentId={studentId}
              exercise={exercise}
              // Match each exercise to this student's saved answer, if any.
              submission={submissions.find(
                (item) => item.exerciseId === exercise._id,
              )}
            />
          ))
        ) : (
          <p>No active exercises are assigned to this student.</p>
        )}
      </div>
    </>
  );
}
