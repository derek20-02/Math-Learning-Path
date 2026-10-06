"use client";

import Exercise from "@/components/Exercise";
import AssignModal from "@/components/AssignModal";
import type { Exercise as ExerciseData, Submission } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Returns all exercises associated with a given activity ID.
export default function ShowExercises() {
  const params = useParams();
  const exerciseId = params.id as string;
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isModelOpen, setIsModelOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/activities/${exerciseId}/exercises`)
      .then((response) => response.json())
      .then((result) => {
        setExercises(result.data.exercises);
        setSubmissions(result.data.submissions);
      });
  }, [exerciseId]);

  return (
    <>
    <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
      
        <button onClick={() => setIsModelOpen(true)} className="bg-blue-500 text-white mx-4 px-4 py-2 rounded hover:bg-blue-600">
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
        <AssignModal onClose={() => setIsModelOpen(false)} exercises={exercises} />
      )}
    </div>
    </>
  );
}
