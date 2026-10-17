## Modelling the user's recent behavior

**Sequence modelling** uses ordered past events to represent a user's evolving behavior. Recent actions can reveal current intent, while longer histories provide more stable evidence.

Neither should automatically replace the other.

## 1. Order and time can change interpretation

```text
laptop → case → charger       an accessory-shopping sequence
charger → case → laptop       similar items, different progression
```

A bag or simple average of the same item vectors loses that order. Include positions, timestamps, or time gaps when they are relevant to the prediction.

A burst of dishwasher-repair viewing can be useful evidence for today's session. It does not establish a permanent change from cooking interests to appliance repair.

## 2. Stop history at the decision

```rrp-visual
sequence-history
```

For a target recommendation at 14:00, use events available before that decision. Do not include the target action or a later event in its own history.

**Padding** fills variable-length sequences to a common shape. A **padding mask** excludes those filler entries. A **causal mask** excludes future entries when learning multiple next-event predictions in one sequence.

For one decision using only its already-observed history, a bidirectional encoder over that past history can be valid. A causal mask is not mandatory solely because the application involves time.

## 3. Different summaries trade information and reuse

| Method | Mechanism | Tradeoff |
|---|---|---|
| Pooling | Average or weighted sum | Cheap; ordinary pooling loses order |
| Recurrent model | Updates a state event by event | Order-aware, sequential updates |
| History self-attention | Lets history entries interact | Needs order/time information when order matters |
| Candidate attention | Weights history for a specific candidate | More joint context, more per-candidate work |

Attention weights alone do not establish why a user acted or which past event caused the next action.

## 4. Validate freshness and coverage

A session representation updated nightly cannot use today's latest actions. Measure event arrival delay, history truncation, session boundaries, and missing-history behavior.

Compare long-term-only, session-only, and combined procedures on later requests, including anonymous and new users. More history may supply useful context or stale noise; tune its scope with realistic latency and data availability.

> **Mental image:** a long-term profile is the bookshelf; recent actions are the books currently open. The current task determines which evidence deserves attention.
