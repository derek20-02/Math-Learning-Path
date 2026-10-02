import type { Exercise } from "@/lib/types";

export const exercises: Exercise[] = [
  {
    id: "fractions-equivalent-01",
    activityId: "fractions-foundations",
    prompt: "Which fraction is equivalent to 1/2?",
    choices: ["2/3", "2/4", "3/5", "4/6"],
    correctAnswer: "2/4",
    submittedAnswer: "2/4",
    explanation:
      "Multiplying the numerator and denominator of 1/2 by 2 gives 2/4.",
    isDone: true,
  },
  {
    id: "fractions-equivalent-02",
    activityId: "fractions-foundations",
    prompt: "Complete the equivalent fraction: 3/4 = ?/8",
    choices: ["5", "6", "7", "8"],
    correctAnswer: "6",
    submittedAnswer: null,
    explanation:
      "The denominator is multiplied by 2, so multiply the numerator by 2 as well: 3 × 2 = 6.",
    isDone: false,
  },
  {
    id: "linear-equations-01",
    activityId: "linear-equations",
    prompt: "Solve for x: x + 7 = 12",
    choices: ["3", "5", "7", "19"],
    correctAnswer: "5",
    submittedAnswer: null,
    explanation: "Subtract 7 from both sides to get x = 12 - 7 = 5.",
    isDone: false,
  },
  {
    id: "linear-equations-02",
    activityId: "linear-equations",
    prompt: "Solve for y: 4y = 28",
    choices: ["6", "7", "24", "32"],
    correctAnswer: "7",
    submittedAnswer: null,
    explanation: "Divide both sides by 4 to get y = 28 ÷ 4 = 7.",
    isDone: false,
  },
  {
    id: "area-perimeter-01",
    activityId: "area-and-perimeter",
    prompt: "A rectangle is 8 cm long and 3 cm wide. What is its area?",
    choices: ["11 cm²", "22 cm²", "24 cm²", "48 cm²"],
    correctAnswer: "24 cm²",
    submittedAnswer: null,
    explanation: "Area is length × width, so 8 × 3 = 24 cm².",
    isDone: false,
  },
  {
    id: "area-perimeter-02",
    activityId: "area-and-perimeter",
    prompt: "A rectangle is 9 m long and 4 m wide. What is its perimeter?",
    choices: ["13 m", "26 m", "36 m", "72 m"],
    correctAnswer: "26 m",
    submittedAnswer: null,
    explanation: "Perimeter is 2 × (length + width), so 2 × (9 + 4) = 26 m.",
    isDone: false,
  },
];

// Returns all exercises associated with a given activity ID.
export function getExercisesByActivityId(activityId: string): Exercise[] {
  return exercises.filter((exercise) => exercise.activityId === activityId);
}
