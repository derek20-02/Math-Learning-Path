"use client";

import Exercise from "@/components/Exercise";
import AssignModal from "@/components/AssignModal";
import type {
  Exercise as ExerciseData,
  ExerciseAssignmentOption,
  Submission,
} from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Returns all exercises associated with a given activity ID.
export default function ShowExercises() {
  const params = useParams();
  const exerciseId = params.id as string;
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<
    ExerciseAssignmentOption[]
  >([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // Ignore an older request if the activity changes or the page unmounts.
    let isCurrent = true;

    async function loadExercises() {
      try {
        const response = await fetch(`/api/activities/${exerciseId}/exercises`);
        if (!response.ok) throw new Error("Could not load activity exercises.");
        const result = await response.json();
        if (!isCurrent) return;

        setExercises(result.data.exercises);
        setSubmissions(result.data.submissions);
        setExerciseOptions(result.data.exerciseOptions);
      } catch (error) {
        if (isCurrent)
          console.error("Failed to load activity exercises:", error);
      }
    }

    void loadExercises();
    return () => {
      isCurrent = false;
    };
  }, [exerciseId, reloadKey]);

  return (
    <>
      <div className="flex flex-col gap-4 mt-8 max-w-xl mx-auto w-full">
        <button
          onClick={() => setIsModelOpen(true)}
          className="bg-blue-500 text-white mx-4 px-4 py-2 rounded hover:bg-blue-600"
        >
          Manage Exercises
        </button>

        {exercises.map((exercise) => (
          <Exercise
            key={exercise._id}
            exercise={exercise}
            submission={submissions.find(
              (item) => item.exerciseId === exercise._id,
            )}
          />
        ))}
        {isModelOpen && (
          <AssignModal
            activityId={exerciseId}
            exercises={exerciseOptions}
            onClose={() => setIsModelOpen(false)}
            // Reload assigned exercises after a successful add or remove.
            onUpdated={() => setReloadKey((current) => current + 1)}
          />
        )}
      </div>
    </>
  );
}
