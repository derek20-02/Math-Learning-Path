import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-white items-center justify-between flex">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row">
        <p className="text-sm">
          © {new Date().getFullYear()} Math Learning Path.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}