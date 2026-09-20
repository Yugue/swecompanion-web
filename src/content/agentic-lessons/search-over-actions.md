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

**Cost discipline.** N candidates cost roughly N times the tokens, though input caching softens it because the prompt prefix is shared. Two ways to keep it economical:

- **Escalate**: try once, sample more only when the first attempt fails verification.
- **Prune early**: generate short plans, verify cheaply, and only expand the survivors into full solutions.

---

## What matters most

- **The pattern fits problems that are hard to solve and easy to check,** and the verifier - not N - sets the ceiling.
- **With a good verifier, sampling converts directly into accuracy;** with a noisy one, larger N finds the candidate that best exploits the judge's blind spots, making things worse.
- **That is the whole reason best-of-N helps on code and not on open-ended writing.**
- **Search over action *sequences* needs reversible steps and cheap partial evaluation,** which production rarely offers - you cannot un-send an email.
- **Keep it economical:** escalate only after the first attempt fails verification, and prune short plans before expanding them.

Next topic is **Reasoning models and thinking budgets**.
