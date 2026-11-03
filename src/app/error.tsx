"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-lg px-6 py-24 text-center">
    <h1 className="text-2xl font-semibold">Something went wrong</h1>
    <p className="mt-3 text-sm text-text-muted">We couldn’t load this page. Please try again.</p>
    <button type="button" onClick={reset} className="mt-6 rounded-lg bg-accent-blue px-5 py-3 text-sm font-semibold text-white">Try again</button>
  </main>;
}
