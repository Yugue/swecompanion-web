## Modelling the user's recent behavior

## 1. Preserve the progression

**Sequence modeling** uses ordered past events to represent behavior. The same items can mean different things in a different order:

```text
laptop → case → charger
charger → case → laptop
```

> Long-term taste is the bookshelf; recent actions are the books currently open.

## 2. Choose an order-aware summary

**Attention** forms a weighted combination of input representations. **Self-attention** lets history entries attend to other entries in that history.

| Method | What it retains |
|---|---|
| Ordinary pooling | Average content, usually not order |
| Recurrent model | A state updated event by event |
| Self-attention | Relationships among history entries |

A **recurrent model** carries information through a sequentially updated state.

Include position or time information when order matters.

## 3. Read history for this candidate

**Candidate-conditioned attention** uses the candidate to choose history weights. A cooking candidate can emphasize cooking events; a car candidate can emphasize car reviews.

A request-only summary can be reused. Candidate-conditioned summaries add joint context but require work per candidate. Attention weights alone do not prove which event caused an action.

## 4. Stop at the decision

```rrp-visual
sequence-history
```

The later target action may supply a label; it cannot appear in that decision's input history.

## 5. Distinguish the masks

**Padding** fills variable-length histories to a common shape. A **padding mask** excludes filler entries.

A **causal mask** prevents earlier predictions from using later sequence entries when training multiple next-event predictions together.

These masks solve different problems.

## 6. Past-only input can be bidirectional

A **bidirectional encoder** lets entries use context from both directions within its input.

If that entire input predates one decision, this can be valid. Causal masking is required by the prediction setup, not simply by the presence of timestamps.

## 7. Measure usable recency

A nightly summary misses today's actions. Compare long-term-only, session-only, and combined inputs on later requests.

Check arrival delay, truncation, and missing-history behavior. Extra history can add context or stale noise.

## 8. Interview reasoning

**Question:** Is bidirectional attention always leakage in recommendations?

**Answer:** No. It can summarize an entirely observed past history. Leakage occurs when a prediction uses information unavailable at its decision time.
