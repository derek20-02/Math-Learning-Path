import type { Exercise, Submission } from "@/lib/types";

// Returns all exercises associated with a given activity ID.
export default function Exercise({
  exercise,
  submission,
}: {
  exercise: Exercise;
  submission: Submission | undefined;
}) {
  return (
    <article className="space-y-3 rounded-lg border border-[var(--borders)] bg-white p-5 shadow-sm m-4">
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
    </article>
  );
}

/*export default function Exercise({ exercise }: { exercise: Exercise }) {
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
              name={exercise._id}
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
}*/
