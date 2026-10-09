import { getCurrentUser } from "@/lib/auth/authorization";
import { redirect } from "next/navigation";

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    if (user.role !== "teacher") redirect("/student");

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b bg-white px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-indigo-700">Panel de Profesor</h1>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                        Profesor
                    </span>
                </div>
            </header>
            <main className="p-6">{children}</main>
        </div>
    );
}