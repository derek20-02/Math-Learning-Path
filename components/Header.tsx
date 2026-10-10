import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[var(--borders)] bg-[var(--cardBackground)]">
      <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center justify-between gap-6 px-5 py-3 md:px-8">
        <Link
          href="/"
          aria-label="Math Learning Path home"
          className="flex min-w-0 items-center gap-3"
        >
          {/* Replace this monogram with the final brand logo when available. */}
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-sky-700 text-lg font-bold text-white"
          >
            M
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold text-[var(--primaryText)]">
              Math Learning Path
            </span>
            <span className="hidden text-xs text-[var(--secondaryText)] sm:block">
              Practice, progress, understanding
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="flex shrink-0 items-center gap-2 sm:gap-4"
        >
          <Link
            href="/activities"
            className="rounded px-2 py-2 text-sm font-medium text-[var(--primaryText)] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:px-3"
          >
            Activities
          </Link>
          <Link
            href="/learning-path"
            className="rounded px-2 py-2 text-sm font-medium text-[var(--primaryText)] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:px-3"
          >
            Learning path
          </Link>
        </nav>
      </div>
    </header>
  );
}
