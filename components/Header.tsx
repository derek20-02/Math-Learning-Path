import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const navigation =
    role === "teacher"
      ? [
          { href: "/activities", label: "Activities" },
          { href: "/activities/new", label: "Create Activities" },
        ]
      : role === "student"
      ? [
          { href: "/learning-path", label: "Learning Path" },
        ]
      : null;

  if (!navigation) {
    return null;
  }

  return (
    <header className="border-b border-[var(--borders)] bg-[var(--cardBackground)]">
      {/* Contenedor principal en una sola fila horizontal (flex-row) con altura mínima fija */}
      <div className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between px-5 py-3 md:min-h-18 md:px-8 gap-4">
        
        {/* Logo / Título (Alineado a la izquierda) */}
        <Link
          href="/"
          aria-label="Math Learning Path home"
          className="flex items-center gap-3 shrink-0"
        >
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-sky-700 text-lg font-bold text-white"
          >
            M
          </span>
          <span className="hidden sm:block min-w-0">
            <span className="block truncate text-base font-semibold text-[var(--primaryText)]">
              Math Learning Path
            </span>
            <span className="block text-xs text-[var(--secondaryText)]">
              Practice, progress, understanding
            </span>
          </span>
        </Link>

        {/* Enlaces y Botón (Alineados estrictamente a la derecha en una sola línea) */}
        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-2 md:gap-4 shrink-0"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2 py-2 text-sm font-medium text-[var(--primaryText)] hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:px-3 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
}