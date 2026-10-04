## Sampling and search over actions

Generate alternatives when solving is difficult and verifying candidates is affordable.

## 1. Best-of-N

```text
task → candidates → independent checks → acceptable result
```

Under independent success probability \(p\) and perfect verification:

\[
P(\text{at least one good})=1-(1-p)^N
\]

For \(p=0.5,N=5\), this is \(31/32\approx96.9\%\).

## 2. Verifier limits

Tests cover tested behavior, not all correctness. Schemas cover structure. Judges can have systematic biases.

More candidates can exploit a weak verifier's blind spots. Measure accepted-result correctness, not only scores.

## 3. Sequence search

```text
state → alternative actions → partial states → expand promising branch
```

Useful search needs meaningful state evaluation and a way to abandon branches safely.

Explore consequential actions in simulation or draft form, not by sending multiple real messages.

## 4. Practical candidates

Code with tests, read-only SQL, and structured extraction can support checkable alternatives.

Open-ended text may need a validated rubric. Subjective preference alone is a weaker selection signal.

## 5. Budget search

Try once, then expand after failed verification. Prune invalid plans before generating full artifacts.

Cap candidate count, tool usage, and elapsed time.

## 6. Diversity and stopping

Five near-identical candidates are not five independent chances.

Vary approaches where useful. Stop when a sufficiently trusted check passes or the budget ends.

## What matters most

> Search buys more chances; verification determines which chances you can safely accept.
