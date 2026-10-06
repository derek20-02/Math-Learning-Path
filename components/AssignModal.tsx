"use client";

import type { Exercise as ExerciseData } from "@/lib/types";

export default function AssignModal({ onClose, exercises }: { onClose: () => void; exercises: ExerciseData[] }) {
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
        <button className="self-end px-2 py-1" onClick={onClose} aria-label="Close dialog">
          X
        </button>
        {exercises.map((exercise) => (
          <div key={exercise._id} className="flex flex-col gap-2 rounded border border-[var(--borders)] p-4">
            <p className="font-semibold">{exercise.prompt}</p>
            <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Assign</button>
            <button className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}