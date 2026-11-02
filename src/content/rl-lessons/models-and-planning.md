# 5.1 Learning a model and planning with it

## 1. Experience can train more than a policy

A learned **environment model** predicts transitions and rewards, letting a robot compare actions before executing them.

**Model-based RL** uses an environment model for control. **Model-free RL** learns values or policies without model-based planning. Collecting ordinary transitions in a simulator does not alone make an algorithm model-based.

## 2. Learn the model from transitions

A deterministic model regresses successor states and rewards. A probabilistic model fits an outcome distribution, for example by negative log likelihood:

\[
L_{\mathrm{model}}=-\mathbb E_{(s,a,s')\sim\mathcal D}
[\log\widehat p_\psi(s'\mid s,a)]
\]

D is real transitions; ψ model weights; p̂ψ predicted successor probability or density. A separate head can predict expected reward. Preserve control-relevant information.

Low error on common actions does not establish accuracy for unusual actions discovered by a planner.

## 3. Dyna uses imagined experience

**Dyna** alternates real interaction, model fitting, and value updates from both real and imagined transitions.

```text
real interaction → transition dataset → model
       ↓                                ↓
 real value update ← same learner ← imagined transitions
       ↓
 improved behavior → more real interaction
```

More updates per real interaction can improve sample efficiency. Incorrect synthetic transitions can also repeatedly reinforce model bias.

## 4. Model Predictive Control plans and replans

**Model predictive control (MPC)** plans an action sequence, executes only its first action, observes the result, and replans.

\[
(a_0^*,\ldots,a_{H-1}^*)\in\arg\max_{a_{0:H-1}}
\mathbb E_{\widehat p}\left[\sum_{k=0}^{H-1}\gamma^k\widehat r(s_k,a_k)
+\gamma^H\widehat V(s_H)\right]
\]

H is horizon; r̂ predicted reward; V̂ optional terminal value; γ discount. Predicted states follow model p̂. Candidate sequences can be sampled when direct optimization is difficult.

Replanning uses new observations to correct the next plan; errors within the current plan remain.

## 5. Why horizon is a tradeoff

Longer planning sees farther consequences but compounds prediction errors. The optimizer can exploit model mistakes rather than real opportunities.

A terminal value shortens explicit lookahead but adds value error. Choose horizon using model trust, value quality, and decision-time budget.

## 6. Model uncertainty and distribution shift

An **ensemble** of separately fitted models can expose disagreement on unfamiliar transitions. Use it to guide collection or cautious planning.

Agreement is not proof of correctness: models can share missing data or assumptions. Check multi-step predictions and actual closed-loop outcomes.

A compact learned representation can reduce modeling cost but must retain reward- and control-relevant information.

## 7. Sample efficiency is not inference efficiency

| Choice | Real interaction cost | Decision-time cost |
|---|---|---|
| Replay-based model-free policy | Can require substantial collection | Usually one policy evaluation |
| Online planning with a model | Can use lookahead to save trials | Multiple predicted rollouts |
| Distill a planner into a policy | Pay planning during data creation | Smaller policy evaluation later |

**Distillation** trains a faster policy to reproduce a planner’s decisions. It trades some planning flexibility for lower decision-time cost.

A sample-efficient planner may still miss a millisecond control deadline. Measure interaction and inference cost separately.
