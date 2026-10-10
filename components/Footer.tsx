export default function Footer() {
  return (
    <footer className="border-t border-[var(--borders)] bg-[var(--cardBackground)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-4 text-center text-sm text-[var(--secondaryText)] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-left">
        <span>
          &copy; {new Date().getFullYear()} Math Learning Path | Helamã Barbour | Derek Moscui | Ivan Antris | Israel Tudela
        </span>
        <span>Practice, progress, understanding</span>
      </div>
    </footer>
  );
}
