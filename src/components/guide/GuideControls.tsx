"use client";

import { Search } from "lucide-react";

export type ProblemFilter = "all" | "remaining" | "complete";

const FILTERS: { value: ProblemFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "remaining", label: "To do" },
  { value: "complete", label: "Done" },
];

export function GuideControls({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  placeholder,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  filter: ProblemFilter;
  onFilterChange: (value: ProblemFilter) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-outline bg-surface py-3.5 pl-10 pr-4 text-sm text-text outline-none focus:border-accent-blue"
        />
      </div>
      <div className="flex gap-1 rounded-lg border border-outline bg-surface p-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onFilterChange(f.value)}
            className={`rounded-md px-3.5 py-2 text-[13px] font-semibold ${
              filter === f.value ? "bg-accent-blue/15 text-accent-blue" : "text-text-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
