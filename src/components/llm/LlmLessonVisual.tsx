import type { ReactNode } from "react";
import { LessonFigure } from "@/components/lesson/LessonFigure";
import { isLlmVisualId, llmVisuals, packedExampleDocuments, packedAttentionAllowed, decoderPipelineExample } from "@/lib/llmVisuals";

function Box({ children }: { children: ReactNode }) {
  return <div className="min-w-0 rounded-lg border border-accent-blue/40 bg-accent-blue/10 px-3 py-2 text-center text-sm leading-relaxed text-text">{children}</div>;
}
function Arrow() { return <div aria-hidden="true" className="py-1 text-center text-accent-blue">↓</div>; }
export function LlmLessonVisual({ id }: { id: string }) {
  if (!isLlmVisualId(id)) throw new Error(`Unknown LLM visual: ${id}`);
  const visual = llmVisuals[id];
  let content: ReactNode;
  switch (id) {
    case "gated-ffn":
      content = <div className="mx-auto max-w-md"><Box>One token state x · width d</Box><Arrow /><div className="grid grid-cols-2 gap-2"><Box>Gate projection Wg<br />↓<br />SiLU activation<br /><span className="text-xs text-text-muted">g · width h</span></Box><Box>Feature projection Wu<br /><span className="text-xs text-text-muted">u · width h</span></Box></div><Arrow /><Box>Multiply matching coordinates · g ⊙ u</Box><Arrow /><Box>Output projection Wo · width d</Box></div>;
      break;
    case "decoder-pipeline": {
      const { tokens: t, width: d, vocabulary: v } = decoderPipelineExample;
      content = <div className="mx-auto max-w-md"><Box>Token IDs · [{t}]</Box><Arrow /><Box>Embedding lookup · [{t}, {d}]</Box><Arrow /><Box>Transformer blocks · [{t}, {d}]<br /><span className="text-xs text-text-muted">Mix tokens, transform features, preserve shape</span></Box><Arrow /><Box>Final normalization + vocabulary head · [{t}, {v}]</Box><Arrow /><Box>Row-wise softmax · [{t}, {v}]</Box><Arrow /><Box>Generate: select from the last row → one next token</Box></div>;
      break;
    }
    case "prediction-loop":
      content = <div className="mx-auto max-w-md"><Box>Prefix: The sky is</Box><Arrow /><div className="grid grid-cols-3 gap-2">{[["blue", "0.6"], ["gray", "0.3"], ["clear", "0.1"]].map(([word, probability]) => <Box key={word}>{word}<br />{probability}</Box>)}</div><Arrow /><Box>Select blue → prefix: The sky is blue</Box><Arrow /><Box>Compute a new next-token distribution</Box></div>;
      break;
    case "shifted-targets":
      content = <div className="grid grid-cols-3 gap-2">{[["BOS", "cats"], ["cats", "sleep"], ["sleep", "EOS"]].map(([input, target], i) => <div key={i} className="min-w-0"><p className="mb-2 text-center text-xs text-text-muted">Position {i + 1}</p><Box>Input<br />{input}</Box><Arrow /><Box>Target<br />{target}</Box></div>)}</div>;
      break;
    case "packed-attention":
      content = <div className="mx-auto max-w-sm"><p className="mb-3 text-center text-xs text-text-muted">Rows: reading position · Columns: source position</p><div className="grid grid-cols-5 gap-1 text-center text-xs"><span />{packedExampleDocuments.map((doc, i) => <span key={i} className="p-2 text-text-muted">{doc}{i % 2 + 1}</span>)}{packedExampleDocuments.map((doc, query) => <div key={query} className="contents"><span className="p-2 text-text-muted">{doc}{query % 2 + 1}</span>{packedExampleDocuments.map((_, key) => <span key={key} className={`rounded border p-2 ${packedAttentionAllowed(query, key) ? "border-accent-blue/50 bg-accent-blue/20 text-text" : "border-outline/50 bg-surface-high text-text-muted"}`}>{packedAttentionAllowed(query, key) ? "Read" : "×"}</span>)}</div>)}</div></div>;
      break;
    case "rag-stages":
      content = <div className="mx-auto max-w-md"><Box>Question + authorized document index</Box><Arrow /><Box>Retrieve candidate passages</Box><Arrow /><Box>Rerank and fit the evidence budget</Box><Arrow /><Box>Selected evidence with source IDs</Box><div className="my-2 rounded border border-dashed border-accent-green/60 p-2 text-center text-xs leading-relaxed text-text-muted">Diagnostic: substitute verified evidence here</div><Arrow /><Box>Generate answer → check claim support and citations</Box></div>;
      break;
  }
  return <LessonFigure id={id} track="llm" visual={visual}><div role="img" aria-label={visual.alt} className="p-4 sm:p-5">{content}</div></LessonFigure>;
}
