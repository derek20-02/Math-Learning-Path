import { getCurrentUser } from "@/lib/auth/authorization";
import { redirect } from "next/navigation";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
export default function StudentLayout({
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
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Barra interna específica para el panel de estudiante */}
            <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <h1 className="text-xl font-bold text-emerald-700">Ruta de Aprendizaje</h1>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        Estudiante
                    </span>
                </div>
            </header>

            {/* Contenido principal de la sección */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6">{children}</main>
        </div>
    );
}