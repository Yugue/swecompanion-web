"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { averageKernel, convolutionImage, edgeKernel, formatValue, validCorrelation } from "@/lib/cvVisualMath";
import { CvFigure } from "./CvFigure";

const control = "inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-outline px-3 text-sm font-semibold text-text transition-colors hover:bg-surface-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-35";

export function ConvolutionDemo() {
  const [position, setPosition] = useState(0);
  const [filter, setFilter] = useState<"edge" | "average">("edge");
  const kernel = filter === "edge" ? edgeKernel : averageKernel;
  const result = validCorrelation(convolutionImage, kernel);
  const row = Math.floor(position / 3), col = position % 3;
  const rowSums = kernel.map((weights, y) =>
    weights.reduce((sum, weight, x) => sum + weight * convolutionImage[row + y][col + x], 0));

  return (
    <CvFigure id="convolution">
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2" aria-label="Choose kernel">
          {(["edge", "average"] as const).map(kind => (
            <button key={kind} type="button" aria-pressed={filter === kind}
              onClick={() => setFilter(kind)}
              className={control + (filter === kind ? " border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]" : "")}>
              {kind === "edge" ? "Find a vertical edge" : "Average the patch"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 items-start gap-5 sm:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="col-span-2 sm:col-span-1">
            <p className="mb-2 text-sm font-semibold text-text">Input · 5 × 5</p>
            <div className="grid grid-cols-5 gap-1" aria-label="Input pixels; outlined cells form the current patch">
              {convolutionImage.flatMap((values, y) => values.map((value, x) => {
                const selected = y >= row && y < row + 3 && x >= col && x < col + 3;
                return <div key={y + ":" + x}
                  className={"flex aspect-square items-center justify-center rounded text-sm font-semibold tabular-nums " + (selected ? "ring-2 ring-inset ring-blue-500" : "")}
                  style={{ background: value ? "#e7edf5" : "#25334a", color: value ? "#182236" : "#fff" }}>
                  {value}
                </div>;
              }))}
            </div>
            <p className="mt-2 text-xs text-text-muted">Blue outline = current 3 × 3 patch</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-text">Kernel · 3 × 3</p>
            <div className="grid grid-cols-3 gap-1">
              {kernel.flatMap((values, y) => values.map((value, x) => (
                <div key={y + ":" + x} className="flex aspect-square items-center justify-center rounded border border-outline/60 bg-surface-high text-sm font-semibold tabular-nums text-text">
                  {filter === "average" ? "1/9" : value}
                </div>
              )))}
            </div>
            <p className="mt-2 text-xs text-text-muted">Same weights at every position</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-text">Feature map · 3 × 3</p>
            <div className="grid grid-cols-3 gap-1" aria-label="Select an output cell">
              {result.flatMap((values, y) => values.map((value, x) => {
                const selected = position === y * 3 + x;
                return <button key={y + ":" + x} type="button"
                  aria-label={"Output row " + (y + 1) + ", column " + (x + 1) + ": " + formatValue(value)}
                  aria-pressed={selected} onClick={() => setPosition(y * 3 + x)}
                  className={"flex aspect-square items-center justify-center rounded border text-sm font-semibold tabular-nums text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 " +
                    (selected ? "border-blue-500 ring-2 ring-blue-500" : "border-outline/60")}
                  style={{ background: "color-mix(in srgb, #4285f4 " + (12 + Math.min(1, Math.abs(value) / (filter === "edge" ? 3 : 1)) * 35) + "%, var(--color-surface, transparent))" }}>
                  {formatValue(value, 2)}
                </button>;
              }))}
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-surface-high/65 p-3" aria-live="polite" aria-atomic="true">
          <p className="text-sm font-semibold text-text">Multiply the aligned cells, then add.</p>
          <p className="mt-1 font-mono text-sm leading-relaxed tabular-nums text-text">
            {rowSums.map(v => formatValue(v)).join(" + ")} = {formatValue(result[row][col])}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            Each term is one patch row&apos;s dot product with its kernel row. Write the sum at output ({row + 1}, {col + 1}).
            {filter === "edge" ? " A positive response marks dark-to-bright change from left to right." : " The average smooths the transition instead of detecting it."}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-text-muted">Position {position + 1} of 9</p>
          <div className="flex gap-2">
            <button type="button" className={control} onClick={() => setPosition(0)} aria-label="Reset kernel position"><RotateCcw size={15} /></button>
            <button type="button" className={control} disabled={position === 0} onClick={() => setPosition(p => p - 1)} aria-label="Previous kernel position"><ChevronLeft size={16} /></button>
            <button type="button" className={control} disabled={position === 8} onClick={() => setPosition(p => p + 1)}>Next patch <ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </CvFigure>
  );
}
