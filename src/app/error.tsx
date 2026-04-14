"use client";

type RootErrorProps = {
  error: Error;
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <main className="min-h-[70vh] bg-black px-4 py-10 text-zinc-100">
      <div className="mx-auto w-full max-w-4xl space-y-3">
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-zinc-400">{error.message || "Unexpected error"}</p>
        <button
          type="button"
          onClick={reset}
          className="rounded border border-zinc-700 px-3 py-2 text-sm hover:border-zinc-500"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
