"use client";

import type {
  ActivityStudentAssignment,
  ExerciseAssignmentOption,
  StudentOption,
} from "@/lib/types";
import { useState } from "react";

type AssignModalProps = {
  activityId: string;
  exercises: ExerciseAssignmentOption[];
  students: StudentOption[];
  assignedStudents: ActivityStudentAssignment[];
  onClose: () => void;
  onUpdated: () => void;
};

export default function AssignModal({
  activityId,
  exercises,
  students,
  assignedStudents,
  onClose,
  onUpdated,
}: AssignModalProps) {
  // Keep dialog status responsive while the server persists the assignment.
  const [exerciseOptions, setExerciseOptions] = useState(exercises);
  const [pendingExerciseId, setPendingExerciseId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentAssignments, setStudentAssignments] =
    useState(assignedStudents);
  const [isAssigningStudent, setIsAssigningStudent] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);

  async function assignStudent() {
    if (!selectedStudentId) return;

    // Keep the selected student in a pending state until the API responds.
    setIsAssigningStudent(true);
    setStudentError(null);

    try {
      const response = await fetch(
        `/api/activities/${activityId}/assignments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: selectedStudentId }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Could not assign this student.");
      }

      // Update the dialog immediately so the new assignee cannot be selected twice.
      setStudentAssignments((current) => [...current, result.data.assignment]);
      setSelectedStudentId("");
      onUpdated();
    } catch (assignmentError) {
      setStudentError(
        assignmentError instanceof Error
          ? assignmentError.message
          : "Could not assign this student.",
      );
    } finally {
      setIsAssigningStudent(false);
    }
  }

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
        <section className="flex flex-col gap-3 rounded border border-[var(--borders)] p-4">
          <h2 className="font-semibold text-[var(--primaryText)]">
            Assign students to this activity
          </h2>
          {studentError && <p role="alert">{studentError}</p>}
          {students.length ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                className="min-w-0 flex-1 rounded border border-[var(--borders)] bg-white px-3 py-2"
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
                aria-label="Choose a student to assign"
              >
                <option value="">Choose a student</option>
                {students.map((student) => {
                  // Existing assignees remain visible but cannot be assigned twice.
                  const alreadyAssigned = studentAssignments.some(
                    (assignment) => assignment.studentId === student.id,
                  );

                  return (
                    <option
                      key={student.id}
                      value={student.id}
                      disabled={alreadyAssigned}
                    >
                      {student.name}
                      {alreadyAssigned ? " (assigned)" : ""}
                    </option>
                  );
                })}
              </select>
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                disabled={!selectedStudentId || isAssigningStudent}
                onClick={() => void assignStudent()}
              >
                {isAssigningStudent ? "Saving..." : "Assign student"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-[var(--secondaryText)]">
              No student accounts are available.
            </p>
          )}
          <div className="flex flex-wrap gap-2" aria-live="polite">
            {studentAssignments.map((assignment) => (
              <span
                key={assignment.id}
                className="rounded border border-[var(--borders)] px-2 py-1 text-sm text-[var(--primaryText)]"
              >
                {assignment.studentName}
              </span>
            ))}
          </div>
        </section>
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
                    {isActive
                      ? "Already assigned"
                      : "Inactive for this activity"}
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
