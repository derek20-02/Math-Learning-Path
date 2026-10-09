"use client";

import StudentActivities from "@/components/StudentActivities";
import type { ActivityProgress } from "@/lib/types";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function StudentActivityPage() {
  const [studentActivities, setStudentActivities] = useState<
    ActivityProgress[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudentActivities() {
      setLoading(true);
      setError(null);

      try {
        const session = await getSession();
        const studentId = (session?.user as { id?: unknown } | undefined)?.id;
        if (typeof studentId !== "string") {
          throw new Error("Could not identify the signed-in student.");
        }

        const response = await fetch(
          `/api/students/${encodeURIComponent(studentId)}/activities`,
          { signal: controller.signal },
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.message ?? "Failed to fetch student activities.",
          );
        }
        setStudentActivities(result.data.studentActivities);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to fetch student activities.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadStudentActivities();
    return () => controller.abort();
  }, []);

  return (
    <>
      {loading ? (
        <p role="status">Loading activities...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <StudentActivities studentActivities={studentActivities} />
      )}
    </>
  );
}