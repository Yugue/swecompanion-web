## Sampling and search over actions

When a solution is **hard to find but easy to check**, the right move is to spend test-time compute generating several candidates and keep one that verifies. The whole pattern lives or dies on the verifier.

### 1. Best-of-N

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

At \(p = 0.5\), five samples reach about 97%. That is the optimistic bound, and it assumes the verifier never passes a bad candidate.

---

### 2. The verifier is the ceiling

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

### 3. Search over sequences

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

In a real environment, step 2 usually fails: you cannot un-send an email or un-charge a card. Search over irreversible actions has to happen in simulation, against mocked tools, or not at all.

---

### 4. Where it pays in practice

```text
✓  code generation with tests       - perfect verifier, free rollback
✓  structured extraction            - schema + cross-field checks
✓  SQL generation                   - run against a read-only replica, compare row counts
✗  sending messages                 - irreversible, no verifier
✗  subjective writing               - verifier is a judge with known biases
```

---

### 5. Cost discipline

N candidates cost roughly N times the tokens, though input caching softens it because the prompt prefix is shared. Two ways to keep it economical:

- **Escalate**: try once, sample more only when the first attempt fails verification.
- **Prune early**: generate short plans, verify cheaply, and only expand the survivors into full solutions.

---

## What you should say in an interview

For "best-of-5 helps on code and not on customer emails":

> The asymmetry is entirely in the verifier. For code I have a near-perfect, nearly free checker - the compiler and the test suite - so sampling five candidates and keeping one that passes converts diversity directly into accuracy; with a perfect verifier the failure rate drops like one minus p to the N. For customer emails my only verifier is an LLM judge, which is noisy and has known biases toward length, position, and its own style. Selecting the best of five under a flawed measure doesn't find the best email, it finds the one that best exploits the judge, so larger N makes it worse rather than better. The general rule I'd state is that best-of-N is a verifier amplifier, not a model amplifier: spend on the verifier first, and if I can't build one better than a judge, I'd rather invest in grounding and a single careful generation. I'd also be careful about search over real actions at all, since branch-and-backtrack assumes reversibility, and in production most side effects aren't.

Next topic is **Reasoning models and thinking budgets**.
