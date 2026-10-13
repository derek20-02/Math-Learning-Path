import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("deletes the exercise after confirmation and notifies the activity page", async () => {
    const onDelete = jest.fn();
    jest.spyOn(window, "confirm").mockReturnValue(true);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Exercise deleted successfully" }),
    });

    render(
      <Exercise exercise={exercise} submission={undefined} onDelete={onDelete} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete exercise" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/exercises/exercise-1", {
        method: "DELETE",
      });
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  it("keeps the exercise visible and shows the server error when deletion is blocked", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        message: "Exercise has submissions and cannot be deleted.",
      }),
    });

    render(
      <Exercise exercise={exercise} submission={undefined} onDelete={jest.fn()} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete exercise" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Exercise has submissions and cannot be deleted.",
    );
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
  });
});
