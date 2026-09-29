## Sampling and search over actions

**Some problems are hard to solve and easy to check.** Writing a function that passes the tests is hard; running the tests takes a second.

Whenever that is true you can trade compute for accuracy: generate several attempts and keep one that passes the check. The whole pattern lives or dies on the quality of that check.

---

## 1. Best-of-N

```text
          ┌── candidate 1 ──► verify ✗
task ──► ─┼── candidate 2 ──► verify ✓  ──► return
          ├── candidate 3 ──► verify ✗
          └── candidate N ──► verify ✓
```

Sampling at nonzero temperature gives genuinely different attempts. If each independently succeeds with probability \(p\) and the verifier is perfect:

\[
P(\text{at least one good}) = 1 - (1-p)^N
\]

### Common issue

At \(p = 0.5\), five samples reach about 97%. That is the optimistic bound, and it assumes the verifier never passes a bad candidate.

---

## 2. The verifier is the ceiling

| Verifier | Strength | Domain |
|---|---|---|
| Unit tests, compiler | Near-perfect, cheap | Code |
| Schema + semantic checks | Strong | Structured extraction |
| Retrieval-based fact check | Moderate | Claims with sources |
| LLM judge | Weak-to-moderate, biased | Open-ended text |
| None ("pick the longest") | Harmful | - |

With a noisy verifier, larger \(N\) is actively bad: you are sampling harder for something that scores well on a flawed measure, which selects for the verifier's blind spots. This is the mechanism behind "best-of-5 helps on code and not on customer emails."

### Rule of thumb

> Increase N only as far as you trust the verifier. A weak verifier turns more samples into a better-optimized mistake.

---

## 3. Search over sequences

Best-of-N samples whole solutions. Tree search explores **action sequences**, expanding promising branches:

```text
        s0
       / | \
     a1  a2  a3          score each partial state
     |       |
    s1      s3           expand the best
   /  \
 a4    a5
```

This needs three things that are common in puzzles and rare in production:

1. States can be **evaluated** partway through.
2. Actions are **reversible**, so a branch can be abandoned.
3. Exploration is **cheap** relative to the value of a better answer.

### Common issue

In a real environment, step 2 usually fails: you cannot un-send an email or un-charge a card. Search over irreversible actions has to happen in simulation, against mocked tools, or not at all.

---

## 4. Where it pays in practice

```text
✓  code generation with tests       - perfect verifier, free rollback
✓  structured extraction            - schema + cross-field checks
✓  SQL generation                   - run against a read-only replica, compare row counts
✗  sending messages                 - irreversible, no verifier
✗  subjective writing               - verifier is a judge with known biases
```

---

## 5. Control the search cost

N candidates cost roughly N times the output tokens, though input caching can soften the repeated prompt cost. Two ways to keep it economical:

- **Escalate**: try once, sample more only when the first attempt fails verification.
- **Prune early**: generate short plans, verify cheaply, and only expand the survivors into full solutions.

---

## 6. Diversity and stopping matter as much as N

The probability formula assumes independent attempts. Model samples are correlated: five nearly identical solutions do not provide five independent chances.

Encourage useful diversity by varying the approach or decomposition, not merely the wording. Stop when a candidate passes a trusted verifier, when marginal improvement flattens, or when the fixed compute budget is exhausted.

### Common issue

Generating all N candidates after the first one already passed a strong verifier wastes compute without improving the decision.

---

## What matters most

- **The pattern fits problems that are hard to solve and easy to check,** and the verifier - not N - sets the ceiling.
- **With a good verifier, sampling converts directly into accuracy;** with a noisy one, larger N finds the candidate that best exploits the judge's blind spots, making things worse.
- **That is the whole reason best-of-N helps on code and not on open-ended writing.**
- **Search over action *sequences* needs reversible steps and cheap partial evaluation,** which production rarely offers - you cannot un-send an email.
- **Keep it economical:** escalate only after the first attempt fails verification, and prune short plans before expanding them.
- **Count distinct approaches, not raw samples,** and stop as soon as trusted verification or the budget says the search is over.

Next topic is **Reasoning models and thinking budgets**.
