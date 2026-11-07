# Tool-using LLM agent for multi-step tasks

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design an AI assistant that completes multi-step workflows using internal APIs: “Find the latest invoice, check whether it was paid, and if not, draft a follow-up email; send it only after I approve.” It must select tools, manage intermediate state, recover from errors, and never perform unauthorized or irreversible actions without the required confirmation.

# 2. Clarification Q&A

| Candidate asks | Interviewer answers (assumed) | Design consequence |
|---|---|---|
| What tasks/actions? | Search records, read calendar, create drafts, send messages, update CRM. | Tool catalog with different risk levels. |
| May it execute actions automatically? | Reads yes; writes only with scoped authorization; irreversible writes need confirmation. | Policy gate + human-in-the-loop (HITL). |
| How long can tasks run? | Up to minutes, with resumable state. | Durable workflow orchestration, checkpoints. |
| What external context? | User chat plus connected app records. | Permissions, freshness, provenance. |
| Reliability requirement? | No duplicate payments/emails or unauthorized actions. | Idempotency, explicit commit boundary. |
| Is full autonomy a requirement? | No; prefer simple deterministic workflow where possible. | Minimal-agent design first. |
| How much traffic? | 100 requests/sec; tail-heavy tasks. | Asynchronous workers, bounded parallel tools. |

# 3. Requirements

**Functional:** understand goal; discover/select authorized tools; extract validated parameters; perform multistep read actions; ask clarifications for missing parameters; plan or revise; request approval before sensitive writes; recover/retry safe failures; provide execution summary and evidence.

**Non-functional:** correctness, authorization, predictable costs, auditable event log, controlled latency and model/tool-call budgets, resumable tasks, high task-completion rate with low unsafe-action rate.

# 4. ML objectives

- **Tool selection precision/recall:** correct tool chosen when appropriate; no inappropriate tool calls.
- **Argument validity:** type, schema, identity, units, and constraints correct.
- **Task success rate:** complete user goal, not merely produce a plausible response.
- **Unsafe/unauthorized action rate:** critical hard constraint; evaluate separately from overall success.
- **Efficiency:** success per LLM token, external API call, dollar, and wall-clock second.
- **Recovery:** rate of correct handling after a tool failure or unexpected response.

A task can have 100% valid JSON and still be wrong (wrong user, incorrect date, duplicate send). Use **end-to-end state correctness**.

# 5. Data

**Sources:** tool schemas and descriptions, policy/risk annotations, successful annotated task trajectories, failed and corrected executions, synthetic sandbox tasks, human feedback, API error patterns, authorization rules, test environment initial/final states.

**Gold labels:** user goal; permitted tools; required information; expected final state; side effects allowed/forbidden; approval decisions; acceptable alternative plans. Capture both correct result and **evidence of how it happened**.

**Data pitfalls:** don't train on raw uncontrolled action logs as if success was guaranteed; never mix production secrets into training. Construct adversarial traces (malicious tool outputs, mismatched identity, stale object IDs, transient 429/timeouts, cyclic tasks).

# 6. High-level architecture

<!-- system-design-diagram -->

**Boundary:** LLM proposes actions; deterministic code validates and executes them. A prompt cannot replace authorization enforcement.

**Planning strategy:** start with one-step tool calling or a small state machine. Use plan–execute–observe loops only when task dependencies warrant them. Keep a bounded max step count to prevent infinite loops.

# 7. Models and training

- Baseline: instruction-following LLM with structured function-calling output and curated tool descriptions/examples. Typed JSON schema validation is deterministic.
- Give the model a **small filtered catalog** of tools based on the user's permissions and current task rather than thousands of unrelated APIs. For large dynamic catalogs, retrieve plausible tools with a bi-encoder + approximate nearest neighbor (ANN) search, then validate the choice; cross-encoder reranking is optional.
- For recurring difficult tasks, supervised fine-tune (SFT) on expert tool-use trajectories (reasoning need not be recorded), structured decisions, and correct parameter extraction. Fine-tune only after verifying model/tool UX bottlenecks.
- Preference optimization or reinforcement learning can improve action choices, but reward hacking is a major risk; success must be judged by external task state and safety constraints.
- Fine-tune a small risk classifier/verifier separately if it reduces cost; **policy enforcement still remains outside the LLM**.

# 8. Execution correctness and security

- **Tool arguments:** validate schema, types, account ownership, resource IDs, currency, time zone, required fields, and allowed scopes.
- **Exactly-once effects:** networks rarely guarantee exactly-once execution. Use idempotency keys, transaction IDs, persisted action state, and post-timeout reconciliation before retrying writes. A timed-out send might have succeeded.
- **Approvals:** generate a complete preview of recipient, content, amount, and impact, then obtain explicit user authorization before executing sensitive actions; bind the approval to immutable arguments.
- **Prompt injection:** untrusted tool/website text must not acquire instruction priority or authorize a new action. Keep untrusted content separate from system policy.
- **Rollback:** compensating transactions may exist for reversible actions; don't claim true rollback for sent emails, purchases, or external effects.
- **Memory:** store explicit task state (goal, slots, steps, results, approvals), not only a growing unstructured conversation. Summarize older context with source pointers; expire secrets.
- **External failures:** exponential backoff for safe reads, circuit breakers, deadlines, bounded parallelism, fallback/human handoff.

# 9. Evaluation and monitoring

**Offline replay** against deterministic, sandboxed tools: task success (correct final state), tool selection and argument accuracy, approval compliance, unnecessary calls, latency and tokens, injected-message resistance. Include partial/ambiguous requests and tool errors.

**Online:** per-step failure rate, unintended side effects, user corrections, requests for clarification, escalations, average cost/task, latency distribution; manual review of high-risk outcomes. A model claiming “done” is not evidence that a task completed.

**Useful ablations:** (A) fixed workflow baseline; (B) LLM single tool; (C) planner + execution loop; (D) fine-tuned planner. Prefer the simplest approach meeting real task-success and safety goals.

# 10. Trade-offs and interview summary

The central trade-off is flexibility versus reliability. Agents handle unfamiliar workflows but expand the action-error surface. Restrict tools, cap actions, and use deterministic validation rather than blindly increasing planning depth.

> **Interview answer:** “I treat the LLM as a planner, not a privileged executor. I define an authorized tool catalog, validate typed action proposals, enforce per-tool permissions and user approvals, and run actions through an idempotent durable orchestrator. I evaluate success against actual final system state, then track unsafe actions, recovery, latency, and cost. I would use a fixed workflow whenever the business process is predictable.”
