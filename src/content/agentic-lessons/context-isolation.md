## Context isolation across agents

Separate worker contexts can keep large intermediate material out of the parent's active window.

## 1. Compression arithmetic

A worker might process 60 documents over several calls and return 900 tokens of findings.

If the parent would otherwise carry 10,000 tokens for ten more turns:

\[
\text{avoided parent input}\approx(10000-900)\times10=91000
\]

Subtract worker and coordination costs to estimate net savings. This is an illustrative comparison.

## 2. Permission isolation

```text
parent → narrow brief → reader with limited permissions → findings
```

A separate prompt is not a security boundary. Enforce credentials, data scope, tool access, and outbound controls in runtime.

Treat returned findings as untrusted evidence until validated.

## 3. Return contract

Cap findings and include sources, gaps, artifact references, and usage.

An 8,000-token transcript may erase the intended compression.

## 4. Avoid excessive isolation

Workers need common goal, constraints, and entity definitions.

Missing shared context creates duplicate discovery or invalid results. Share the essentials without exposing unrelated sensitive data.

## 5. Tradeoffs

Isolation can lose cross-cutting clues and add traces to debug. The slowest required branch can delay completion.

Use bounded checkpoints to redistribute useful findings when needed.

## What matters most

> Keep the worker's paperwork local; pass verified findings and unresolved gaps across the boundary.
