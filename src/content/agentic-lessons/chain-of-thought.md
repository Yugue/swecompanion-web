## Chain of thought and its limits

Letting a model write intermediate tokens before answering buys it **more computation per decision**. That is the entire mechanism. Everything true about chain of thought - what it helps, what it doesn't, and why you can't trust it as an explanation - follows from that one fact.

---

## 1. The mechanism

A forward pass does a fixed amount of work per token. Producing 200 reasoning tokens before the answer means the answer is computed after 200 extra passes, each conditioned on what came before.

```text
direct:     question ──────────────────► answer        (one shot of compute)
CoT:        question ──► t₁ t₂ ... tₙ ──► answer        (n extra passes, serialized)
```

### Core intuition

So chain of thought converts **tokens into serial computation**. It does not add knowledge, retrieve facts, or check anything against the world.

---

## 2. What that predicts, and what is observed

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

## 3. Where the extra tokens help, and where they do not

Two questions, same model, with and without reasoning:

```text
"What is the capital of Australia?"
  direct     → "Canberra"                        correct
  with CoT   → "Let me think. Australia's largest city is Sydney, but the
                capital is a planned city... Canberra."   correct, 40× the tokens

  → the fact was in the weights or it was not. Thinking added latency, nothing else.
```

```text
"A refund window is 30 days. The order shipped on 2 March, was delivered on
 6 March, and the policy measures from delivery. Today is 3 April. Eligible?"
  direct     → "Yes, it is within 30 days."       WRONG
  with CoT   → "Measured from delivery: 6 March. 6 March + 30 days = 5 April.
                Today is 3 April, which is before 5 April. Eligible."   correct
```

The second needs several dependent steps held in order - which date to measure from, add 30, compare. Producing intermediate tokens gives the model somewhere to put each step instead of collapsing the whole chain into one guess.

### Rule of thumb

That is the rule, and it generalizes: **reasoning tokens buy serial computation, so they help when the bottleneck is computation and do nothing when the bottleneck is knowledge.**

---

## 4. The faithfulness problem

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

## 5. The cost

Reasoning tokens are output tokens, generated serially, on every turn where you enable them.

```text
30-step agent × 250 reasoning tokens/step = 7,500 output tokens
                                          + the latency of generating them serially
                                          + they persist in the transcript afterward
```

That last line is often missed: reasoning from step 3 is still in the context at step 25, being re-sent and consuming window.

**Using it well in an agent**

- Make it **conditional**: short or no reasoning for routine steps, full reasoning for planning and diagnosis.
- Keep it **short** - a few lines beat a page; length correlates with drift, not accuracy.
- Consider **dropping old reasoning** from the transcript during compaction while keeping the decisions and observations, which is where the information actually is.

---

## What matters most

- **Reasoning tokens buy serial computation, nothing else.** They are extra forward passes; they add no knowledge and check nothing against the world.
- **So it helps where the bottleneck is computation** - arithmetic, logic, multi-constraint planning - and does nothing for recall, where it only adds latency.
- **The written reasoning is a plausible narrative, not a faithful trace.** Never treat it as an audit log; if a decision needs justification, ground it in a citation you can verify.
- **It costs on every turn and persists afterwards:** step 3's reasoning is still in the context at step 25, being re-sent.
- **Make it conditional and short.** Full reasoning for planning and diagnosis, little or none for routine steps; length correlates with drift, not accuracy.

Next topic is **ReAct: interleaving reasoning and acting**.
