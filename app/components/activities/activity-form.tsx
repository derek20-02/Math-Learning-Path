"use client";

import { FormEvent, useState } from "react";

type Difficulty = "easy" | "medium" | "hard";

export default function ActivityForm() {
    const [objective, setObjective] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>("medium");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMessage("");
        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/activities", {
                method: "POST",
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
                setError(data.error ?? "Unable to create activity.");
                return;
            }

            setMessage("Activity created successfully.");

            setObjective("");
            setDescription("");
            setDifficulty("medium");
        } catch {
            setError("Unable to connect to the server.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="objective">Objective</label>
                <input
                    id="objective"
                    name="objective"
                    type="text"
                    value={objective}
                    onChange={(event) => setObjective(event.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="difficulty">Difficulty</label>
                <select
                    id="difficulty"
                    name="difficulty"
                    value={difficulty}
                    onChange={(event) =>
                        setDifficulty(event.target.value as Difficulty)
                    }
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Activity"}
            </button>

            {error && <p role="alert">{error}</p>}

            {message && <p role="status">{message}</p>}
        </form>
    );
}