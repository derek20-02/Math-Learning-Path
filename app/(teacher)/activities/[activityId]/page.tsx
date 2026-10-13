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
  const activityId = params.activityId as string;
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<
    ExerciseAssignmentOption[]
  >([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<
    ActivityStudentAssignment[]
  >([]);
  const [prompt, setPrompt] = useState("");
  const [answerType, setAnswerType] =
    useState<ExerciseData["answerRules"]["type"]>("short-answer");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [choicesText, setChoicesText] = useState("");
  const [tolerance, setTolerance] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  async function createExercise(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreateMessage(null);
    setIsCreating(true);

    const choices = choicesText
      .split("\n")
      .map((choice) => choice.trim())
      .filter(Boolean);

    try {
      const response = await fetch(`/api/activities/${activityId}/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          answerRules: {
            type: answerType,
            expected: expectedAnswer,
            ...(answerType === "numeric" && tolerance
              ? { tolerance: Number(tolerance) }
              : {}),
          },
          ...(answerType === "multiple-choice" ? { choices } : {}),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Could not create exercise.");
      }

      setPrompt("");
      setExpectedAnswer("");
      setChoicesText("");
      setTolerance("");
      setCreateMessage("Exercise created and added to this activity.");
      setReloadKey((current) => current + 1);
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Could not create exercise.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  useEffect(() => {
    // Ignore an older request if the activity changes or the page unmounts.
    let isCurrent = true;

    async function loadExercises() {
      try {
        // Load exercise management data and student assignments in parallel.
        const [exerciseResponse, assignmentResponse] = await Promise.all([
          fetch(`/api/activities/${activityId}/exercises`),
          fetch(`/api/activities/${activityId}/assignments`),
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
  }, [activityId, reloadKey]);

  return (
    <>
      <div className="flex flex-col gap-4 mt-8 max-w-xl mx-auto w-full">
        <button
          onClick={() => setIsModelOpen(true)}
          className="bg-blue-500 text-white mx-4 px-4 py-2 rounded hover:bg-blue-600"
        >
          Manage Exercises
        </button>

        <form
          onSubmit={createExercise}
          className="flex flex-col gap-3 rounded-lg border border-[var(--borders)] bg-white p-5"
        >
          <h2 className="text-lg font-semibold text-[var(--primaryText)]">
            Create Exercise
          </h2>
          <label className="flex flex-col gap-1 text-sm text-[var(--primaryText)]">
            Prompt
            <textarea
              required
              minLength={3}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="rounded border border-[var(--borders)] px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[var(--primaryText)]">
            Answer Type
            <select
              value={answerType}
              onChange={(event) =>
                setAnswerType(
                  event.target.value as ExerciseData["answerRules"]["type"],
                )
              }
              className="rounded border border-[var(--borders)] bg-white px-3 py-2"
            >
              <option value="short-answer">Short Answer</option>
              <option value="numeric">Numeric</option>
              <option value="true-false">True / False</option>
              <option value="multiple-choice">Multiple Choice</option>
            </select>
          </label>
          {answerType === "true-false" ? (
            <label className="flex flex-col gap-1 text-sm text-[var(--primaryText)]">
              Correct Answer
              <select
                value={expectedAnswer}
                onChange={(event) => setExpectedAnswer(event.target.value)}
                required
                className="rounded border border-[var(--borders)] bg-white px-3 py-2"
              >
                <option value="">Choose True or False</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </label>
          ) : (
            <label className="flex flex-col gap-1 text-sm text-[var(--primaryText)]">
              Correct Answer
              <input
                required
                value={expectedAnswer}
                onChange={(event) => setExpectedAnswer(event.target.value)}
                className="rounded border border-[var(--borders)] px-3 py-2"
              />
            </label>
          )}
          {answerType === "multiple-choice" && (
            <label className="flex flex-col gap-1 text-sm text-[var(--primaryText)]">
              Choices (one per line)
              <textarea
                required
                value={choicesText}
                onChange={(event) => setChoicesText(event.target.value)}
                className="rounded border border-[var(--borders)] px-3 py-2"
              />
            </label>
          )}
          {answerType === "numeric" && (
            <label className="flex flex-col gap-1 text-sm text-[var(--primaryText)]">
              Tolerance (optional)
              <input
                type="number"
                min="0"
                step="any"
                value={tolerance}
                onChange={(event) => setTolerance(event.target.value)}
                className="rounded border border-[var(--borders)] px-3 py-2"
              />
            </label>
          )}
          {createError && (
            <p role="alert" className="text-sm text-[var(--errorMsg)]">
              {createError}
            </p>
          )}
          {createMessage && (
            <p role="status" className="text-sm text-[var(--successMsg)]">
              {createMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={isCreating}
            className="self-start rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Create exercise"}
          </button>
        </form>

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
            activityId={activityId}
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