import { render, screen } from "@testing-library/react";
import Exercise from "@/components/Exercise";
import type { Exercise as ExerciseData, Submission } from "@/lib/types";

describe("Teacher exercise card", () => {
  const exercise: ExerciseData = {
    _id: "exercise-1",
    activityId: "activity-1",
    prompt: "What is 2 + 2?",
    answerRules: { type: "numeric", expected: "4" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it.each([
    [true, "Correct"],
    [false, "Incorrect"],
  ])("shows %s grading status for a submitted answer", (isCorrect, status) => {
    const submission: Submission = {
      _id: "submission-1",
      exerciseId: exercise._id,
      studentId: "student-1",
      assignmentId: "assignment-1",
      answer: "4",
      attemptNumber: 1,
      isCorrect,
      status: "graded",
      submittedAt: new Date(),
    };

    render(<Exercise exercise={exercise} submission={submission} />);

    expect(screen.getByRole("status")).toHaveTextContent(status);
  });
});
