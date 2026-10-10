import Footer from "@/components/Footer";
import Header from "@/components/Header";
export default function StudentLayout({
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
                        <h1 className="text-xl font-bold text-emerald-700">Ruta de Aprendizaje</h1>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                            Estudiante
                        </span>
                    </div>
                </header>
                <main className="p-6">{children}</main>
            </div>
            <Footer />
        </>
    );
}