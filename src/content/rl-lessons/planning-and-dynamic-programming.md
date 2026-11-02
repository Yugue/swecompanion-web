# 2.1 Planning with a known model: evaluation and improvement

## 1. Ask the model before acting

**Planning** computes decisions from a model; **learning** estimates useful quantities from experience. A system may do both.

**Dynamic programming (DP)** reuses solutions to overlapping subproblems. Bellman backups reuse successor values to evaluate earlier choices.

## 2. Evaluate a fixed policy

**Policy evaluation** predicts a fixed policy’s return. Initialize V, keep terminal values zero, and repeatedly apply the model-based expectation backup:

\[
V_{k+1}(s)=\mathbb E_{a\sim\pi,\,s',r\sim p}[r+\gamma V_k(s')\mid s]
\]

k counts planning sweeps, s is state, π the fixed policy, p the environment model, r reward, and γ discount. Finite discounted evaluation with bounded rewards converges to \(V^\pi\).

## 3. Improve the evaluated policy

**Policy improvement** chooses actions using the evaluated continuation:

\[
\pi_{\mathrm{new}}(s)\in\arg\max_a
\mathbb E_{s',r\sim p}[r+\gamma V^\pi(s')\mid s,a]
\]

πnew selects a maximizing action a. \(V^\pi\) evaluates the old policy after successor s′; p averages rewards r and transitions.

Exact greedy improvement cannot lower discounted policy value. Approximate values can invalidate that guarantee.

## 4. Policy iteration alternates two jobs

```text
policy → evaluate its future returns → improve its actions
   ↑                                      ↓
   └──────────── repeat until stable ──────┘
```

**Policy iteration** alternates evaluation and greedy improvement. **Modified policy iteration** performs only partial evaluation between improvements.

**Generalized policy iteration** names the broader interaction between improving estimates and improving behavior. They need not proceed at equal speeds.

## 5. Value iteration combines the jobs

**Value iteration** combines evaluation and improvement in one optimality backup:

\[
V_{k+1}(s)=\max_a\mathbb E_{s',r\sim p}[r+\gamma V_k(s')\mid s,a]
\]

k indexes sweeps; Vₖ is the current estimate. Maximize over actions and average environmental outcomes. Extract a greedy policy from the resulting values.

For finite discounted MDPs, each backup shrinks maximum value error by at most γ. Near-one discounts can therefore slow convergence.

## 6. A two-action planning example

Exit gives reward 2 and terminates. Continue gives −1 and reaches value 5. At γ=0.9 their backups are 2 and 3.5: choose continue.

If the successor value falls to 1, continue’s backup becomes −0.1: choose exit. Poor continuation estimates can reverse the decision.

## 7. Computation and information limits

| Method | What remains fixed during a basic step? | Main operation |
|---|---|---|
| Policy evaluation | Policy | Expected backup |
| Policy iteration | Policy during evaluation | Evaluate, then improve |
| Value iteration | Current estimates within a synchronous sweep | Optimality backup |

A dense sweep costs roughly states²×actions; sparse transitions reduce work. Continuous or enormous state spaces make enumeration impractical. Sampled planning avoids full expectations but adds sampling error.
