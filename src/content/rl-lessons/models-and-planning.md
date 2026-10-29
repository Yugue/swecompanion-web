# 5.1 Learning a model and planning with it

## 1. Experience can train more than a policy

A warehouse robot can learn what its motors do to its position and how congestion affects movement. A learned **environment model** predicts transitions and rewards; planning can use it to compare actions before executing them.

**Model-based RL** learns or uses such a model for control. **Model-free RL** learns policies or values without using an explicit transition model for planning. A simulator used only to collect ordinary transitions does not automatically make the learning algorithm model-based.

## 2. Learn the model from transitions

A deterministic model might predict a next-state vector and expected reward with regression losses. A probabilistic model predicts a distribution over outcomes and can be fitted by negative log likelihood.

\[
L_{\mathrm{model}}=-\mathbb E_{(s,a,s')\sim\mathcal D}
[\log\widehat p_\psi(s'\mid s,a)]
\]

D is the real transition dataset, psi model parameters, and p hat the learned transition density or probability. A separate reward head can estimate expected reward. Input and output choices must preserve information relevant to control.

Low prediction error on typical transitions does not guarantee accuracy for the unusual actions a planner may discover.

## 3. Dyna uses imagined experience

**Dyna** combines real interaction, model fitting, and simulated updates. After observing a real transition, update the model and value learner. Then sample modeled transitions and perform additional value backups.

```text
real interaction → transition dataset → model
       ↓                                ↓
 real value update ← same learner ← imagined transitions
       ↓
 improved behavior → more real interaction
```

The gain is more learning computation per real interaction. The cost is model-induced bias: synthetic transitions can repeatedly reinforce an error.

## 4. Model Predictive Control plans and replans

**Model Predictive Control (MPC)** optimizes an action sequence over a finite model horizon, executes only its first action, receives a real observation, and replans.

\[
(a_0^*,\ldots,a_{H-1}^*)\in\arg\max_{a_{0:H-1}}
\mathbb E_{\widehat p}\left[\sum_{k=0}^{H-1}\gamma^k\widehat r(s_k,a_k)
+\gamma^H\widehat V(s_H)\right]
\]

H is planning horizon, r hat predicted reward, and V hat an optional terminal value. State predictions follow the learned model. Candidate sequences can be sampled and compared when direct optimization is difficult.

Replanning uses new evidence to correct earlier prediction errors. It does not remove errors within the currently chosen plan.

## 5. Why horizon is a tradeoff

A longer horizon considers more delayed consequences, but repeated prediction can compound error. The optimizer may find a sequence that exploits a model mistake rather than a real opportunity.

A terminal value estimate can shorten explicit planning, but adds its own approximation error. A good planning horizon balances useful lookahead, model reliability, terminal-value quality, and decision-time compute.

## 6. Model uncertainty and distribution shift

Multiple separately fitted models can reveal some disagreement about unfamiliar transitions. A planner can prefer actions with lower uncertainty or collect data where disagreement matters.

An ensemble is not a guarantee of calibrated uncertainty: its members may share a wrong assumption or lack the same data. Validate predictions across action ranges and multi-step rollouts, then compare actual closed-loop control outcomes.

Models may operate in a learned compact representation instead of raw observations. The representation still needs to retain information useful for reward and action consequences.

## 7. Sample efficiency is not inference efficiency

| Choice | Real interaction cost | Decision-time cost |
|---|---|---|
| Replay-based model-free policy | Can require substantial collection | Usually one policy evaluation |
| Online planning with a model | Can use lookahead to save trials | Multiple predicted rollouts |
| Distill a planner into a policy | Pay planning during data creation | Smaller policy evaluation later |

If a control deadline permits only milliseconds, an expensive planner may be infeasible even when sample efficient. Distillation trades some planner flexibility for a faster policy.
