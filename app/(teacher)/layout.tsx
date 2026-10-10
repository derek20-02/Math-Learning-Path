import Footer from "@/components/Footer";
import Header from "@/components/Header";
export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="min-h-screen bg-slate-50">
                <Header />
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
            <Footer />
        </>
    );
}