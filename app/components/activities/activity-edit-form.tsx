"use client";

import { FormEvent, useState } from "react";

type Difficulty = "easy" | "medium" | "hard";

interface ActivityEditFormProps {
    activityId: string;
    initialObjective: string;
    initialDescription: string;
    initialDifficulty: Difficulty;
}

export default function ActivityEditForm({
    activityId,
    initialObjective,
    initialDescription,
    initialDifficulty,
}: ActivityEditFormProps) {
    const [objective, setObjective] = useState(initialObjective);
    const [description, setDescription] = useState(initialDescription);
    const [difficulty, setDifficulty] =
        useState<Difficulty>(initialDifficulty);

    const [savedObjective, setSavedObjective] = useState(initialObjective);
    const [savedDescription, setSavedDescription] =
        useState(initialDescription);
    const [savedDifficulty, setSavedDifficulty] =
        useState<Difficulty>(initialDifficulty);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMessage("");
        setError("");
        setIsSubmitting(true);

        // Keep the previous confirmed state in case the update fails.
        const previousObjective = savedObjective;
        const previousDescription = savedDescription;
        const previousDifficulty = savedDifficulty;

        // Optimistically treat the edited values as the new state.
        setSavedObjective(objective);
        setSavedDescription(description);
        setSavedDifficulty(difficulty);

        try {
            const response = await fetch(`/api/activities/${activityId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    objective,
                    description,
                    difficulty,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Roll back to the last confirmed state.
                setObjective(previousObjective);
                setDescription(previousDescription);
                setDifficulty(previousDifficulty);

                setSavedObjective(previousObjective);
                setSavedDescription(previousDescription);
                setSavedDifficulty(previousDifficulty);

                setError(data.error ?? "Unable to update activity.");
                return;
            }

            setMessage("Activity updated successfully.");
        } catch {
            // Roll back if the request itself fails.
            setObjective(previousObjective);
            setDescription(previousDescription);
            setDifficulty(previousDifficulty);

            setSavedObjective(previousObjective);
            setSavedDescription(previousDescription);
            setSavedDifficulty(previousDifficulty);

            setError("Unable to connect to the server.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputStyles =
        "w-full rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 text-[#1E293B] outline-none transition focus:border-[#61A8DF] focus:ring-2 focus:ring-[#61A8DF]/30";

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
            <div>
                <label
                    htmlFor="objective"
                    className="mb-2 block font-semibold text-[#1E293B]"
                >
                    Objective
                </label>

                <input
                    id="objective"
                    name="objective"
                    type="text"
                    value={objective}
                    onChange={(event) => setObjective(event.target.value)}
                    className={inputStyles}
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="mb-2 block font-semibold text-[#1E293B]"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={5}
                    className={`${inputStyles} resize-y`}
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="difficulty"
                    className="mb-2 block font-semibold text-[#1E293B]"
                >
                    Difficulty
                </label>

                <select
                    id="difficulty"
                    name="difficulty"
                    value={difficulty}
                    onChange={(event) =>
                        setDifficulty(event.target.value as Difficulty)
                    }
                    className={inputStyles}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#61A8DF] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "Saving..." : "Save Changes"}
            </button>

            {error && (
                <p
                    role="alert"
                    className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-[#DC2626]"
                >
                    {error}
                </p>
            )}

            {message && (
                <p
                    role="status"
                    className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-[#15803D]"
                >
                    {message}
                </p>
            )}
        </form>
    );
}