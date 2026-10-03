"use client";

import Exercise from "@/components/Exercise";
import type { Exercise as ExerciseData, Submission } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Returns all exercises associated with a given activity ID.
export default function ShowExercises() {
  const params = useParams();
  const exerciseId = params.id as string;
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

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
      {exercises.map((exercise) => (
        <Exercise
          key={exercise._id}
          exercise={exercise}
          submission={submissions.find(
            (item) => item.exerciseId === exercise._id,
          )}
        />
      ))}
    </>
  );
}
