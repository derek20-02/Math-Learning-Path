"use client";

import type { ExerciseAssignmentOption } from "@/lib/types";
import { useState } from "react";

type AssignModalProps = {
  activityId: string;
  exercises: ExerciseAssignmentOption[];
  onClose: () => void;
  onUpdated: () => void;
};

export default function AssignModal({
  activityId,
  exercises,
  onClose,
  onUpdated,
}: AssignModalProps) {
  // Keep dialog status responsive while the server persists the assignment.
  const [exerciseOptions, setExerciseOptions] = useState(exercises);
  const [pendingExerciseId, setPendingExerciseId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function updateAssignment(
    exercise: ExerciseAssignmentOption,
    action: "assign" | "deactivate" | "activate",
  ) {
    // Disable other actions and clear any earlier request error.
    setPendingExerciseId(exercise._id);
    setError(null);

    try {
      const response = await fetch(`/api/activities/${activityId}/exercises`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId: exercise._id, action }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ?? "Could not update exercise assignment.",
        );
      }

      // Reflect the successful change immediately, then refresh the activity list.
      setExerciseOptions((current) =>
        current.map((option) =>
          option._id === exercise._id
            ? {
                ...option,
                activityId:
                  action === "assign" ? activityId : option.activityId,
                assignedActivityId:
                  action === "assign" ? activityId : option.assignedActivityId,
                isActive: action !== "deactivate",
              }
            : option,
        ),
      );
      onUpdated();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update exercise assignment.",
      );
    } finally {
      setPendingExerciseId(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Assign exercises"
        className="flex max-h-[85vh] w-full max-w-lg flex-col gap-3 overflow-y-auto rounded border border-[var(--borders)] bg-[var(--background)] p-2 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="self-end px-2 py-1"
          onClick={onClose}
          aria-label="Close dialog"
        >
          X
        </button>
        {error && <p role="alert">{error}</p>}
        {exerciseOptions.map((exercise) => {
          // Only the current activity's exercises can be removed from this dialog.
          const isAssigned = exercise.assignedActivityId === activityId;
          const isActive = exercise.isActive !== false;
          const isAssignedElsewhere =
            exercise.assignedActivityId !== null && !isAssigned;

          return (
            <div
              key={exercise._id}
              className="flex flex-col gap-2 rounded border border-[var(--borders)] p-4"
            >
              <p className="font-semibold">{exercise.prompt}</p>
              {isAssigned ? (
                <>
                  <p className="text-sm text-[var(--secondaryText)]">
                    {isActive ? "Already assigned" : "Inactive for this activity"}
                  </p>
                  <button
                    type="button"
                    className={`${isActive ? "bg-red-600 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600"} rounded px-4 py-2 text-white disabled:opacity-50`}
                    disabled={pendingExerciseId !== null}
                    onClick={() =>
                      void updateAssignment(
                        exercise,
                        isActive ? "deactivate" : "activate",
                      )
                    }
                  >
                    {pendingExerciseId === exercise._id
                      ? isActive
                        ? "Deactivating..."
                        : "Activating..."
                      : isActive
                        ? "Deactivate"
                        : "Reactivate"}
                  </button>
                </>
              ) : isAssignedElsewhere ? (
                <p className="text-sm text-[var(--secondaryText)]">
                  Already assigned to another activity
                </p>
              ) : (
                <button
                  type="button"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                  disabled={pendingExerciseId !== null}
                  onClick={() => void updateAssignment(exercise, "assign")}
                >
                  {pendingExerciseId === exercise._id
                    ? "Assigning..."
                    : "Assign"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
