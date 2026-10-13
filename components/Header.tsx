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
          { href: "/activities", label: "Actividades" },
          { href: "/activities/new", label: "Crear Actividades" },
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
      {/* Usamos flex-col en celulares y flex-row de tablets en adelante */}
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-5 py-3 md:flex-row md:min-h-18 md:px-8">
        
        {/* Logo / Título */}
        <Link
          href="/"
          aria-label="Math Learning Path home"
          className="flex w-full items-center justify-between md:w-auto md:justify-start gap-3"
        >
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-sky-700 text-lg font-bold text-white"
          >
            M
          </span>
          <span className="min-w-0 flex-1 md:flex-initial">
            <span className="block truncate text-base font-semibold text-[var(--primaryText)]">
              Math Learning Path
            </span>
            <span className="hidden text-xs text-[var(--secondaryText)] sm:block">
              Practice, progress, understanding
            </span>
          </span>
        </Link>

        {/* Enlaces y Botón (se acomodan abajo en celular y al lado en PC) */}
        <nav
          aria-label="Primary navigation"
          className="flex w-full flex-wrap items-center justify-center gap-2 md:w-auto md:justify-end sm:gap-4"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2 py-2 text-sm font-medium text-[var(--primaryText)] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:px-3"
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