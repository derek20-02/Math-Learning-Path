"use client";

import Exercise from "@/components/Exercise";
import AssignModal from "@/components/AssignModal";
import type {
  ActivityStudentAssignment,
  Exercise as ExerciseData,
  ExerciseAssignmentOption,
  StudentOption,
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
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<
    ActivityStudentAssignment[]
  >([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // Ignore an older request if the activity changes or the page unmounts.
    let isCurrent = true;

    async function loadExercises() {
      try {
        // Load exercise management data and student assignments in parallel.
        const [exerciseResponse, assignmentResponse] = await Promise.all([
          fetch(`/api/activities/${exerciseId}/exercises`),
          fetch(`/api/activities/${exerciseId}/assignments`),
        ]);
        if (!exerciseResponse.ok || !assignmentResponse.ok) {
          throw new Error("Could not load activity management data.");
        }
        const [exerciseResult, assignmentResult] = await Promise.all([
          exerciseResponse.json(),
          assignmentResponse.json(),
        ]);
        if (!isCurrent) return;

        setExercises(exerciseResult.data.exercises);
        setSubmissions(exerciseResult.data.submissions);
        setExerciseOptions(exerciseResult.data.exerciseOptions);
        // These records populate the student selector and its assigned list.
        setStudents(assignmentResult.data.students);
        setStudentAssignments(assignmentResult.data.assignments);
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
            students={students}
            assignedStudents={studentAssignments}
            onClose={() => setIsModelOpen(false)}
            // Reload assigned exercises after a successful add or remove.
            onUpdated={() => setReloadKey((current) => current + 1)}
          />
        )}
      </div>
    </>
  );
}
