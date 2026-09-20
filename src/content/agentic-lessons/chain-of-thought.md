## Chain of thought and its limits

Letting a model write intermediate tokens before answering buys it **more computation per decision**. That is the entire mechanism. Everything true about chain of thought - what it helps, what it doesn't, and why you can't trust it as an explanation - follows from that one fact.

### 1. The mechanism

A forward pass does a fixed amount of work per token. Producing 200 reasoning tokens before the answer means the answer is computed after 200 extra passes, each conditioned on what came before.

```text
direct:     question ──────────────────► answer        (one shot of compute)
CoT:        question ──► t₁ t₂ ... tₙ ──► answer        (n extra passes, serialized)
```

So chain of thought converts **tokens into serial computation**. It does not add knowledge, retrieve facts, or check anything against the world.

---

### 2. What that predicts, and what is observed

| Task type | Helps? | Why |
|---|---|---|
| Multi-step arithmetic | Strongly | Each step is a sub-computation |
| Logic, constraint satisfaction | Strongly | Intermediate state has to live somewhere |
| Multi-hop planning | Yes | Decomposition is the work |
| Factual recall | No | The fact is in the weights or it isn't |
| Classification, extraction | Marginal or negative | Adds latency, invites over-thinking |

### Rule of thumb

> Chain of thought helps when the bottleneck is computation, not when the bottleneck is knowledge.

---

### 3. The faithfulness problem

This is the part interviewers probe.

```text
written reasoning:  "The order was placed in March, so the 30-day window
                     has expired, therefore the refund is denied."

actual computation: a distribution over tokens that produced both the
                     narrative and the conclusion
```

The text is a **plausible** explanation, generated alongside the answer - not a transcript of how the answer was computed. Models can produce correct reasoning and a wrong answer, or reasoning that omits the cue that actually drove the decision.

Practical consequences:

1. Do not use stated reasoning as an audit log for a decision that needs one.
2. A trace where the thought and the tool call disagree tells you the output is unreliable - it does not tell you which half was "really" the model's belief.
3. If you need justification, ground it: cite the retrieved clause, and check that the cited clause exists and says that.

---

### 4. The cost

Reasoning tokens are output tokens, generated serially, on every turn where you enable them.

```text
30-step agent × 250 reasoning tokens/step = 7,500 output tokens
                                          + the latency of generating them serially
                                          + they persist in the transcript afterward
```

That last line is often missed: reasoning from step 3 is still in the context at step 25, being re-sent and consuming window.

---

### 5. Using it well in an agent

- Make it **conditional**: short or no reasoning for routine steps, full reasoning for planning and diagnosis.
- Keep it **short** - a few lines beat a page; length correlates with drift, not accuracy.
- Consider **dropping old reasoning** from the transcript during compaction while keeping the decisions and observations, which is where the information actually is.

---

## What you should say in an interview

For "the agent's stated reasoning contradicts the tool call it makes":

> It tells me the output isn't trustworthy on that step - but it doesn't tell me which half reflects the model's "real" belief, because neither does. The written reasoning is generated text that's plausible given the context, not a transcript of the computation, so it can be faithful, decorative, or contradictory, and I can't treat it as an audit log. What I do with it is practical: treat contradiction as a signal to inspect that step, and if the decision needs justification, ground it in something checkable - have the agent cite the retrieved policy clause and verify the clause exists and says what it claims. The mechanism is worth stating too: chain of thought buys serial computation per decision, so it helps on arithmetic, logic, and planning and does nothing for recall, which is also why I'd make it conditional on task difficulty rather than always on.

Next topic is **ReAct: interleaving reasoning and acting**.
