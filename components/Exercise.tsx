import type { Exercise } from "@/lib/types";

// Returns all exercises associated with a given activity ID.
export default function Exercise({ exercise }: { exercise: Exercise }) {
  return (
    <div
      className="border-[var(--borders)] rounded-lg p-4 m-5 bg-white shadow-md"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <h3 className="text-lg font-semibold text-[var(--primaryText)] mb-2">
        {exercise.prompt}
      </h3>
      <div className="space-y-2">
        {exercise.choices.map((choice, index) => (
          <label
            key={index}
            className="flex text-[var(--secondaryText)] items-center space-x-2"
          >
            <input
              readOnly
              type="radio"
              name={exercise.id}
              value={choice}
              checked={exercise.submittedAnswer === choice}
            />
            <span>{choice}</span>
          </label>
        ))}
      </div>
      <p className="text-sm text-muted-foreground text-[var(--secondaryText)] mt-2">
        {exercise.explanation}
      </p>
      <p>
        {exercise.submittedAnswer === null ? (
          <span className="text-[var(--errorMsg)]">Not answered</span>
        ) : exercise.submittedAnswer === exercise.correctAnswer ? (
          <span className="text-[var(--successMsg)]">Correct!</span>
        ) : (
          <span className="text-[var(--errorMsg)]">Incorrect.</span>
        )}
      </p>
    </div>
  );
}
