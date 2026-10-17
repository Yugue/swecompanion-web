"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { formatValue as fmt, mlpForwardBackward, mlpParameters, updateMlp } from "@/lib/cvVisualMath";
import { CvFigure } from "./CvFigure";

const stages = ["Inputs", "Hidden layer", "Prediction + loss", "Loss gradient", "Back through ReLU", "Weight gradient", "One update"];
const forward = "#4285f4", backward = "#d97706";
const forwardInk = "color-mix(in srgb, #4285f4 65%, var(--color-text))";
const backwardInk = "color-mix(in srgb, #d97706 65%, var(--color-text))";
const control = "inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-outline px-3 text-sm font-semibold text-text hover:bg-surface-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-35";

function Arrow({ x1, y1, x2, y2, color, dashed = false, width = 2 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean; width?: number;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1), size = 7;
  const points = [[x2, y2], [x2 - size * Math.cos(angle - 0.45), y2 - size * Math.sin(angle - 0.45)],
    [x2 - size * Math.cos(angle + 0.45), y2 - size * Math.sin(angle + 0.45)]];
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dashed ? "5 4" : undefined} /><polygon points={points.map(p => p.join(",")).join(" ")} fill={color} /></g>;
}

export function MlpBackpropDemo({ mode = "backprop" }: { mode?: "forward" | "backprop" }) {
  const [stage, setStage] = useState(0);
  const forwardOnly = mode === "forward";
  const visibleStages = forwardOnly ? ["Inputs", "Hidden layer", "Prediction"] : stages;
  const original = mlpForwardBackward();
  const updated = updateMlp(mlpParameters, original.gradients, 0.05);
  const values = stage === 6 ? mlpForwardBackward(updated) : original;
  const activeForward = stage < 3 || stage === 6;
  const muted = "var(--color-outline, #94a3b8)";
  const label = { fill: "var(--color-text, #1f2937)", fontSize: 14, fontFamily: "inherit" };

  const descriptions = [
    "Start with x₁ = 1, x₂ = 2. The target is 1. W₁ = [[0.5, −0.5], [1, 0]], hidden biases [0, 0], output weights [1, 2], output bias 0.",
    "z₁ = 0.5 × 1 − 0.5 × 2 = −0.5; ReLU gives h₁ = 0. z₂ = 1 × 1 + 0 × 2 = 1; ReLU gives h₂ = 1.",
    "The linear output is ŷ = 1 × 0 + 2 × 1 = 2. Squared loss L = ½(ŷ − 1)² = 0.5. The forward pass changed no weights.",
    "Start backward at the loss: ∂L/∂ŷ = ŷ − target = 1. This is the upstream sensitivity sent toward the hidden layer.",
    "Output weights give ∂L/∂h = [1, 2]. ReLU derivatives at z = [−0.5, 1] are [0, 1], so ∂L/∂z = [0, 2]. The inactive branch receives zero weight gradient.",
    "For w₂₂, multiply local factors along its path: ∂L/∂ŷ × ∂ŷ/∂h₂ × ∂h₂/∂z₂ × ∂z₂/∂w₂₂ = 1 × 2 × 1 × 2 = 4. The last factor is input x₂.",
    "Update every parameter once at rate 0.05 using the previous gradients. W₁ becomes [[0.5, −0.5], [0.9, −0.2]], hidden biases [0, −0.1], output weights [1, 1.95], output bias −0.05.",
  ];
  if (forwardOnly) {
    descriptions[0] = "Start with x₁ = 1, x₂ = 2. W₁ = [[0.5, −0.5], [1, 0]], hidden biases [0, 0], output weights [1, 2], output bias 0. Each line is a weighted connection.";
    descriptions[2] = "The linear output is ŷ = 1 × 0 + 2 × 1 = 2. A zero hidden feature contributes nothing; the active hidden unit supplies the output. No weights changed during this forward pass.";
  }

  return (
    <CvFigure id={forwardOnly ? "mlp-forward" : "mlp-backprop"}>
      <div className="p-4">
        <div className="mb-3 flex flex-wrap gap-1.5" aria-label="MLP computation stages">
          {visibleStages.map((name, i) => (
            <button key={name} type="button" aria-pressed={stage === i} onClick={() => setStage(i)}
              className={"rounded-md border px-2.5 py-2 text-xs font-semibold text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 " +
                (stage === i ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]" : "border-outline/60 hover:bg-surface-high")}>
              {i + 1}. {name}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto rounded-lg bg-surface-high/35 focus-visible:outline-2 focus-visible:outline-blue-500" tabIndex={0} role="region" aria-label="Scrollable MLP diagram">
          <svg viewBox={forwardOnly ? "0 0 540 315" : "0 0 680 315"} role="img" aria-label={"MLP stage " + visibleStages[stage] + ". " + descriptions[stage]} className={"h-auto w-full " + (forwardOnly ? "min-w-[520px]" : "min-w-[600px]")}>
            <text x="65" y="28" textAnchor="middle" style={label}>Inputs</text>
            <text x="260" y="28" textAnchor="middle" style={label}>Hidden · ReLU</text>
            <text x="455" y="28" textAnchor="middle" style={label}>Linear output</text>
            {!forwardOnly && <text x="600" y="28" textAnchor="middle" style={label}>Loss</text>}
            {[100, 230].map((y, input) => [100, 230].map((hy, hidden) => (
              <Arrow key={input + ":" + hidden} x1={97} y1={y} x2={226} y2={hy}
                color={activeForward && stage >= 1 ? forward : muted}
                dashed={hidden === 0 && stage >= 4 && stage < 6} width={input === 1 && hidden === 1 && stage === 5 ? 4 : 2} />
            )))}
            {[100, 230].map((y, i) => <Arrow key={y} x1={294} y1={y} x2={421} y2={165}
              color={activeForward && stage >= 2 ? forward : muted} dashed={i === 0 && stage >= 4 && stage < 6} />)}
            {!forwardOnly && <Arrow x1={489} y1={165} x2={566} y2={165} color={activeForward && stage >= 2 ? forward : muted} />}
            {stage >= 3 && stage < 6 && <Arrow x1={566} y1={187} x2={489} y2={187} color={backward} width={3} />}
            {stage >= 4 && stage < 6 && <>
              <Arrow x1={421} y1={183} x2={298} y2={238} color={backward} width={3} />
              <Arrow x1={421} y1={147} x2={298} y2={106} color={backward} dashed />
            </>}
            {stage === 5 && <Arrow x1={226} y1={249} x2={98} y2={249} color={backward} width={3} />}
            {[100, 230].map((y, i) => <g key={y}>
              <circle cx="65" cy={y} r="32" fill="var(--color-surface, #fff)" stroke={forward} strokeWidth="2" />
              <text x="65" y={y + 5} textAnchor="middle" style={label}>{i === 0 ? "x₁ = 1" : "x₂ = 2"}</text>
              <circle cx="260" cy={y} r="34" fill={i === 0 ? "var(--color-surface, #fff)" : "color-mix(in srgb, #4285f4 12%, var(--color-surface, #fff))"}
                stroke={i === 0 ? muted : forward} strokeWidth="2" />
              <text x="260" y={y + 5} textAnchor="middle" style={label}>
                {"h" + (i === 0 ? "₁" : "₂") + (stage >= 1 ? " = " + fmt(values.h[i]) : "")}
              </text>
              {stage >= 1 && <text x="260" y={y + 53} textAnchor="middle" style={{ ...label, fontSize: 12 }}>
                {"z" + (i === 0 ? "₁" : "₂") + " = " + fmt(values.z[i])}
              </text>}
            </g>)}
            <circle cx="455" cy="165" r="34" fill="var(--color-surface, #fff)" stroke={forward} strokeWidth="2" />
            <text x="455" y="170" textAnchor="middle" style={label}>{"ŷ" + (stage >= 2 ? " = " + fmt(values.prediction) : "")}</text>
            {!forwardOnly && <>
              <rect x="566" y="134" width="80" height="62" rx="12" fill="var(--color-surface, #fff)" stroke={stage >= 3 && stage < 6 ? backward : forward} strokeWidth="2" />
              <text x="606" y="160" textAnchor="middle" style={label}>L</text>
              <text x="606" y="181" textAnchor="middle" style={{ ...label, fontSize: 13 }}>{stage >= 2 ? fmt(values.loss, 5) : "½(ŷ − 1)²"}</text>
            </>}
            <text x="163" y="82" textAnchor="middle" style={{ ...label, fontSize: 12 }}>w₁₁ = 0.5</text>
            <text x="163" y="218" textAnchor="middle" style={{ ...label, fontSize: 12 }}>{"w₂₂ = " + (stage === 6 ? "−0.2" : "0")}</text>
            <text x="355" y="102" textAnchor="middle" style={{ ...label, fontSize: 12 }}>v₁ = 1</text>
            <text x="357" y="241" textAnchor="middle" style={{ ...label, fontSize: 12 }}>{"v₂ = " + (stage === 6 ? "1.95" : "2")}</text>
            {stage >= 3 && stage < 6 && <text x="523" y="220" textAnchor="middle" fill={backwardInk} fontSize="13">∂L/∂ŷ = 1</text>}
            {stage >= 4 && stage < 6 && <>
              <text x="355" y="72" textAnchor="middle" fill={backwardInk} fontSize="13">∂L/∂z₁ = 0</text>
              <text x="355" y="273" textAnchor="middle" fill={backwardInk} fontSize="13">∂L/∂z₂ = 2</text>
            </>}
            {stage === 5 && <text x="162" y="280" textAnchor="middle" fill={backwardInk} fontSize="14" fontWeight="700">∂L/∂w₂₂ = 4</text>}
          </svg>
        </div>
        <div className="mt-3 rounded-lg bg-surface-high/65 p-3" aria-live="polite" aria-atomic="true">
          <p className="text-sm font-bold text-text">{visibleStages[stage]}</p>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{descriptions[stage]}</p>
          {stage === 5 && <p className="mt-2 font-mono text-xs leading-relaxed text-text">∇W₁ = [[0, 0], [2, 4]]; ∇b₁ = [0, 2]; ∇v = [0, 1]; ∂L/∂b = 1</p>}
          {stage === 6 && <p className="mt-2 text-sm font-semibold text-text">New prediction = 0.73 · loss 0.5 → 0.03645. Backprop computed the gradients; the update changed the weights.</p>}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-text-muted"><span style={{ color: forwardInk }}>Blue: forward</span>{!forwardOnly && <> · <span style={{ color: backwardInk }}>Orange: backward</span></>}</p>
          <div className="flex gap-2">
            <button type="button" className={control} onClick={() => setStage(0)} aria-label="Restart MLP walkthrough"><RotateCcw size={15} /></button>
            <button type="button" className={control} disabled={stage === 0} onClick={() => setStage(s => s - 1)} aria-label="Previous MLP stage"><ChevronLeft size={16} /></button>
            <button type="button" className={control} disabled={stage === visibleStages.length - 1} onClick={() => setStage(s => s + 1)}>Next step <ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </CvFigure>
  );
}
