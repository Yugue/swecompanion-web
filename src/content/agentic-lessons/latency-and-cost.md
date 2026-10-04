## Latency and token economics

Cost depends on every call's input, output, tools, and additional compute. Latency depends on the execution path.

## 1. Token cost

For \(n\) calls and per-token prices \(p_{\mathrm{in}},p_{\mathrm{out}}\):

\[
C_{\mathrm{tokens}}=\sum_{i=1}^{n}
(p_{\mathrm{in}}c_i+p_{\mathrm{out}}o_i)
\]

\(c_i,o_i\) are input/output counts. Add applicable cached-input, reasoning, tool, and infrastructure charges.

## 2. Growing history

With 3,000 base tokens and 1,500 added per prior step, 20 input contexts total:

\[
20(3000)+1500\frac{20(19)}{2}=345000
\]

This simplified model excludes generated outputs in later history and caching. It shows why repeated payloads matter.

## 3. Optimization levers

Reduce unnecessary steps, compact observations, select evidence, use supported caching, and compare cheaper routes.

Parallel calls can shorten latency and reduce decision turns; their results still consume tokens.

No lever has a universal payoff order.

## 4. Latency follows the critical path

```text
model → independent tools in parallel → model → dependent tool → final
```

Measure queueing, tool time, model processing, and tail latency. Set deadlines and a partial-result path.

## 5. Perceived latency

Streaming and honest progress updates help users understand waiting.

Do not present unverified conclusions as completed results.

## 6. Design backward from a budget

Illustrative prices: $2 per million input tokens, $8 per million output tokens.

10,000 input plus 1,000 output costs **$0.028**, before other charges. These are hypothetical rates.

An eight-second deadline also constrains tool round trips.

## 7. Allocate reserves

Reserve time and usage for final output and recovery. Give stages local allowances within a global budget.

A slow lookup should not consume the ability to report the blocker.

## 8. Cost per success

\[
\text{cost per success}=\frac{\text{total cost}}{\text{successful tasks}}
\]

Compare quality and tail cost too. Cheap failed runs are not productive savings.

## Interview mental model

> Count the whole journey, including the paperwork carried into each stop.
