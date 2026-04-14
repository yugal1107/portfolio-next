import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-black px-4 text-center text-zinc-100">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="text-zinc-400">The page you requested does not exist.</p>
      <Link href="/" className="rounded border border-zinc-700 px-4 py-2 text-zinc-200 hover:border-zinc-500">
        Back to home
      </Link>
    </main>
  );
}
