"use client";

import { getExercisesByActivityId } from "@/lib/data/exercises";
import Exercise from "@/components/Exercise";
import { useParams } from "next/navigation";

// Returns all exercises associated with a given activity ID.
export default function ShowExercises() {
  const params = useParams();
  const exerciseId = params.id as string;
  const exercises = getExercisesByActivityId(exerciseId);

  return (
    <>
      {exercises.map((exercise) => (
        <Exercise key={exercise.id} exercise={exercise} />
      ))}
    </>
  );
}
