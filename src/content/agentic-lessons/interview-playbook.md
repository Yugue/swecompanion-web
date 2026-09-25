## Answering agentic AI questions

The domain interview is not a vocabulary test. The graded skill is narrowing a broad prompt to one concept and explaining that concept clearly - with mechanism, tradeoff, and a concrete example. This lesson is the script.

The previous lesson covered what a complete design contains. This lesson covers delivery: how to make that reasoning easy to follow under interview time pressure.

---

## 1. The shape of an answer

```text
1. one-sentence definition           show you know the term
2. ONE clarifying question           make the interviewer pick a direction
3. ── they choose ──
4. mechanism                         what literally happens, step by step
5. concrete example with numbers     make it real
6. tradeoff + when you'd choose differently
7. stop                              silence is fine
```

### Common issue

Steps 2 and 7 are where most candidates lose time. Surveying everything you know is read as an inability to prioritize.

---

## 2. Grounding in mechanism

Agentic answers are strongest when they describe what is physically in the system:

```text
weak:   "The agent remembers the conversation."
strong: "The model is stateless, so each turn re-sends the transcript;
         'memory' is that resend plus a store I write to deliberately."

weak:   "We add guardrails to keep it safe."
strong: "The tool checks authorization against the session identity before
         executing, so the rule holds even if the model is adversarial."
```

### Core intuition

Every strong version names the context window, the tool boundary, or the loop. That vocabulary is the tell that you have built one.

---

## 3. Tradeoffs to have ready

| Question | Tradeoff to name |
|---|---|
| Should this be an agent? | Flexibility vs. predictability, cost, and testability |
| Multi-agent? | Parallelism and context isolation vs. coordination and debuggability |
| More reasoning? | Accuracy vs. latency and tokens, on a tunable curve |
| Bigger context? | Recall vs. cost, latency, and distraction |
| More autonomy? | Capability vs. blast radius; gate on reversibility |

### Rule of thumb

> Reach for the simpler architecture first. Proposing an agent where a workflow suffices is the most common way to look inexperienced.

---

## 4. Phrases that land

```text
"Let me check what 'done' means here before I design the loop."
"I'd put that in the runtime rather than the prompt, so it holds regardless."
"That's a tool-design problem before it's a prompting problem."
"I'd want to see traces before I decide which layer to fix."
"Before I add an agent, is the path actually data-dependent?"
```

Each one signals production experience in a sentence.

**What to do when you don't know.** Say what you do know, name the boundary, and reason forward:

> I haven't used that specific framework, but the problem it solves is coordinating subagents with isolated contexts, which I'd approach as an orchestrator with typed briefs and structured returns. What matters is the handoff contract, so I'd want to know how it handles that.

That answers the underlying question and is far stronger than bluffing a feature list.

---

## What matters most

The graded skill is narrowing a broad prompt to one concept and explaining it concretely.

```text
1. define in one sentence
2. ask ONE clarifying question   ← then let them choose the direction
3. mechanism: what literally happens, step by step
4. a concrete example with numbers
5. the trade-off, and when you would choose differently
6. stop
```

- **Ground answers in mechanism.** Say "the model is stateless, so each turn re-sends the transcript" rather than "the agent remembers" - naming the context window, the tool boundary, or the loop is the tell that you have built one.
- **Put enforcement in the right layer out loud:** "I'd put that in the runtime rather than the prompt, so it holds regardless."
- **Reach for the simpler architecture first.** Proposing an agent where a workflow suffices is the most common way to look inexperienced.
- **When you do not know, name the boundary and reason forward** - that answers the underlying question far better than bluffing a feature list.

---

## Chapter 7 checkpoint

Design backwards from a success-rate target, p95 latency, per-request budget, and maximum side-effect risk. State the trace schema, regression gate, deployment unit, rollback path, degraded behavior, and first metric that would reveal deterioration.

You have reached the end of this guide. Go back to any chapter and re-read the "what matters most" sections - together they are a compact summary of the whole domain.
