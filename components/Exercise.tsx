import type { Exercise, Submission } from "@/lib/types";
import { useState } from "react";

// Returns all exercises associated with a given activity ID.
export default function Exercise({
  exercise,
  submission,
  onDelete,
}: {
  exercise: Exercise;
  submission: Submission | undefined;
  onDelete?: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function deleteExercise() {
    if (!onDelete || isDeleting) return;
    if (
      !window.confirm(
        "Delete this exercise? Exercises with student submissions cannot be deleted.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/exercises/${exercise._id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Could not delete this exercise.");
      }

      onDelete();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete this exercise.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <article className="space-y-3 rounded-lg border border-[var(--borders)] bg-white p-5 shadow-sm m-4 text-black" >
      <h2 className="font-semibold text-[var(--primaryText)]">
        {exercise.prompt}
      </h2>
      {exercise.answerRules.type === "multiple-choice" ? (
        <div className="space-y-2">
          {exercise.choices?.map((choice, index) => (
            <label
              key={index}
              className="flex items-center space-x-2 text-[var(--secondaryText)]"
            >
              <input
                readOnly
                type="radio"
                name={exercise._id}
                value={choice}
                checked={submission?.answer === choice}
              />
              <span>{choice}</span>
            </label>
          ))}
        </div>
      ) : exercise.answerRules.type === "short-answer" ? (
        <input
          readOnly
          type="text"
          value={submission?.answer ?? ""}
          placeholder="Not answered"
        />
      ) : exercise.answerRules.type === "true-false" ? (
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-[var(--secondaryText)]">
            <input
              readOnly
              type="radio"
              name={exercise._id}
              value="true"
              checked={submission?.answer === "true"}
            />
            <span>True</span>
          </label>
          <label className="flex items-center space-x-2 text-[var(--secondaryText)]">
            <input
              readOnly
              type="radio"
              name={exercise._id}
              value="false"
              checked={submission?.answer === "false"}
            />
            <span>False</span>
          </label>
        </div>
      ) : exercise.answerRules.type === "numeric" ? (
        <input
          readOnly
          type="number"
          value={submission?.answer ?? ""}
          placeholder="Not answered"
        />
      ) : null}
      {submission && (
        <p
          className={`text-sm font-medium ${
            submission.isCorrect
              ? "text-[var(--successMsg)]"
              : "text-[var(--errorMsg)]"
          }`}
          role="status"
        >
          {submission.isCorrect ? "Correct" : "Incorrect"}
        </p>
      )}
      {onDelete && (
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => void deleteExercise()}
            disabled={isDeleting}
            className="rounded bg-[var(--errorMsg)] px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete exercise"}
          </button>
          {deleteError && (
            <p role="alert" className="w-full text-left text-sm text-[var(--errorMsg)]">
              {deleteError}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

export function StudentExercise({
  exercise,
  submission,
  activityId,
  studentId,
}: {
  exercise: Exercise;
  submission: Submission | undefined;
  activityId: string;
  studentId: string;
}) {
  // A saved submission turns the exercise into a read-only answer review.
  const [answer, setAnswer] = useState(submission?.answer ?? "");
  const [savedSubmission, setSavedSubmission] = useState(submission);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAnswered = Boolean(savedSubmission);

  async function submitAnswer() {
    // Prevent duplicate clicks while the API stores and grades this response.
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/activities/${activityId}/exercises/${exercise._id}/submissions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, answer }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Could not save your answer.");
      }

      // Use the returned record to lock the inputs and show the saved response.
      setSavedSubmission(result.data.submission as Submission);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save your answer.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="space-y-3 rounded-lg border border-[var(--borders)] bg-white p-5 shadow-sm m-4 ">
      <h2 className="font-semibold text-[var(--primaryText)]">
        {exercise.prompt}
      </h2>
      {exercise.answerRules.type === "multiple-choice" ? (
        <div className="space-y-2">
          {exercise.choices?.map((choice, index) => (
            <label
              key={index}
              className="flex items-center space-x-2 text-[var(--secondaryText)]"
            >
              <input
                type="radio"
                name={exercise._id}
                value={choice}
                checked={
                  isAnswered
                    ? savedSubmission?.answer === choice
                    : answer === choice
                }
                disabled={isAnswered || isSaving}
                onChange={() => setAnswer(choice)}
              />
              <span>{choice}</span>
            </label>
          ))}
        </div>
      ) : exercise.answerRules.type === "short-answer" ? (
        <input
          type="text"
          value={isAnswered ? (savedSubmission?.answer ?? "") : answer}
          placeholder="Not answered"
          disabled={isAnswered || isSaving}
          onChange={(event) => setAnswer(event.target.value)}
        />
      ) : exercise.answerRules.type === "true-false" ? (
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-[var(--secondaryText)]">
            <input
              type="radio"
              name={exercise._id}
              value="true"
              checked={
                isAnswered
                  ? savedSubmission?.answer === "true"
                  : answer === "true"
              }
              disabled={isAnswered || isSaving}
              onChange={() => setAnswer("true")}
            />
            <span>True</span>
          </label>
          <label className="flex items-center space-x-2 text-[var(--secondaryText)]">
            <input
              type="radio"
              name={exercise._id}
              value="false"
              checked={
                isAnswered
                  ? savedSubmission?.answer === "false"
                  : answer === "false"
              }
              disabled={isAnswered || isSaving}
              onChange={() => setAnswer("false")}
            />
            <span>False</span>
          </label>
        </div>
      ) : exercise.answerRules.type === "numeric" ? (
        <>
          {/* Fraction answers such as 2/4 need text input; decimals use numeric input. */}
          <input
            className="w-full rounded border border-[var(--borders)] px-3 py-2 text-[var(--primaryText)]"
            type={
              typeof exercise.answerRules.expected === "string" &&
              exercise.answerRules.expected.includes("/")
                ? "text"
                : "number"
            }
            inputMode={
              typeof exercise.answerRules.expected === "string" &&
              exercise.answerRules.expected.includes("/")
                ? "text"
                : "decimal"
            }
            value={isAnswered ? (savedSubmission?.answer ?? "") : answer}
            placeholder="Not answered"
            disabled={isAnswered || isSaving}
            onChange={(event) => setAnswer(event.target.value)}
          />
        </>
      ) : null}
      {isAnswered ? (
        <p className="text-sm text-[var(--secondaryText)]" role="status">
          Answer saved{savedSubmission?.isCorrect ? " · Correct" : ""}
        </p>
      ) : (
        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={!answer.trim() || isSaving}
          onClick={() => void submitAnswer()}
        >
          {isSaving ? "Saving..." : "Submit answer"}
        </button>
      )}
      {error && <p role="alert">{error}</p>}
    </article>
  );
}
