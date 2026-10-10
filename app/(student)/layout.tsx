import { getCurrentUser } from "@/lib/auth/authorization";
import { redirect } from "next/navigation";

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Read the signed-in user's session before rendering any student pages.
    const user = await getCurrentUser();
    // Require login and keep teacher accounts out of student-only pages.
    if (!user) redirect("/login");
    if (user.role !== "student") redirect("/teacher");

    return (
        <div className="flex flex-1 flex-col bg-slate-50">
            <header className="border-b bg-white px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-emerald-700">Ruta de Aprendizaje</h1>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        Estudiante
                    </span>
                </div>
            </header>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}