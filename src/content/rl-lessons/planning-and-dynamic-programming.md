# 2.1 Planning with a known model: evaluation and improvement

## 1. Ask the model before acting

If every gridworld transition probability and reward is known, the robot can compare future routes without trying each one physically. **Planning** computes decisions from a model. **Learning** estimates useful quantities from data; a system may do both.

**Dynamic Programming (DP)** solves a larger decision problem by reusing solutions to overlapping subproblems. Bellman backups provide exactly that reusable structure.

## 2. Evaluate a fixed policy

Initialize an estimate V arbitrarily, with terminal values fixed at zero. A full expected backup applies the Bellman expectation equation from 1.6 to each state using the known model and the chosen policy.

\[
V_{k+1}(s)=\mathbb E_{a\sim\pi,\,s',r\sim p}[r+\gamma V_k(s')\mid s]
\]

The subscript k counts planning sweeps, not environment time. The policy stays fixed during evaluation. With a finite state space, bounded rewards, and gamma below one, repeated evaluation converges to its value function.

## 3. Improve the evaluated policy

\[
\pi_{\mathrm{new}}(s)\in\arg\max_a
\mathbb E_{s',r\sim p}[r+\gamma V^\pi(s')\mid s,a]
\]

The new policy chooses an action with maximal expected one-step reward plus evaluated continuation. Using exact policy values, this greedy improvement cannot lower value in the discounted MDP.

The reasoning is local but repeatable: choose a first action at least as good as the old policy's average, then continue improving future choices. With approximate or erroneous values, the guarantee requires additional conditions and may fail.

## 4. Policy iteration alternates two jobs

```text
policy → evaluate its future returns → improve its actions
   ↑                                      ↓
   └──────────── repeat until stable ──────┘
```

**Policy iteration** alternates evaluation and greedy improvement. Evaluation need not always run to machine precision; **modified policy iteration** interleaves partial evaluation and improvement.

This pattern explains **generalized policy iteration**: evaluation and control can improve together even when they run at different speeds. Later sampled algorithms reuse this organization without full-model sweeps.

## 5. Value iteration combines the jobs

\[
V_{k+1}(s)=\max_a\mathbb E_{s',r\sim p}[r+\gamma V_k(s')\mid s,a]
\]

**Value iteration** applies an optimality backup at each sweep. Extract a greedy policy from the converged values. The backup's expected outcomes still use the model; the maximization is over actions, not random environmental outcomes.

For a finite discounted MDP, the Bellman optimality operator shrinks maximum value-estimation error by at most gamma per application. This contraction explains convergence and why gamma near one can slow planning.

## 6. A two-action planning example

Action exit gives 2 and terminates. Action continue gives −1 and reaches a state currently estimated at 5. At gamma=0.9, their backup values are 2 and 3.5.

A greedy improvement selects continue. If the successor estimate is later corrected to 1, its backup falls to −0.1 and exit becomes preferred. Planning quality therefore depends on model accuracy and sufficient evaluation, not the existence of a maximization alone.

## 7. Computation and information limits

| Method | What remains fixed during a basic step? | Main operation |
|---|---|---|
| Policy evaluation | Policy | Expected backup |
| Policy iteration | Policy during evaluation | Evaluate, then improve |
| Value iteration | Current estimates within a synchronous sweep | Optimality backup |

A dense sweep can require work proportional to the number of states squared times the number of actions. Sparse transitions reduce that cost, but large or continuous state spaces still resist enumeration. Sampled planning avoids full expectations but introduces sampling error.
