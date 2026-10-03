"use client";

import Activities from "@/components/Activities";
import type { ActivityProgress } from "@/lib/types";
import { useEffect, useState } from "react";

export default function StudentsActivities() {
  const [activities, setActivities] = useState<ActivityProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      try {
        const response = await fetch("/api/activities", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Could not load activities.");

        const result: { data: ActivityProgress[] } = await response.json();
        setActivities(result.data);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load activities.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadActivities();
    return () => controller.abort();
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-8 bg-zinc-50 p-6 md:p-10">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Learning path
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          Activities
        </h1>
      </header>
      {loading ? (
        <p role="status">Loading activities...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : activities.length ? (
        <Activities activities={activities} />
      ) : (
        <p>No activities found.</p>
      )}
    </main>
  );
}
