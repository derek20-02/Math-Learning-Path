"use client";

import StudentActivities from "@/components/StudentActivities";
import type { ActivityProgress } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function StudentActivityContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const [studentActivities, setStudentActivities] = useState<
    ActivityProgress[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;

    const controller = new AbortController();

    async function loadStudentActivities() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/students/${encodeURIComponent(studentId ?? "")}/activities`,
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
  }, [studentId]);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-10">
      <h1 className="text-2xl font-semibold">Activities Dashboard</h1>
      {!studentId ? (
        <p role="alert">A studentId query parameter is required.</p>
      ) : loading ? (
        <p role="status">Loading activities...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <StudentActivities studentActivities={studentActivities} />
      )}
    </main>
  );
}

export default function StudentActivityPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading page...</p>}>
      <StudentActivityContent />
    </Suspense>
  );
}