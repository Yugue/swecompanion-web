# 6.4 Diagnosing failed or unstable training

## 1. Debug from observable facts

Flat reward can reflect environment bugs, missing exploration, wrong targets, poor objectives, or failed optimization. Changing many settings obscures the cause.

Start with a tiny controlled task. A deterministic two-state example can expose errors before another expensive run.

## 2. Verify the environment and reward first

Run random and known-good policies. Inspect actions, reward, episode length, success labels, and actual trajectories.

If known-good behavior cannot succeed, inspect reachability, action scaling, resets, and reward computation before tuning the learner.

## 3. Check numerical targets by hand

Hand-check reward 1, γ=0.9, continuation 5: continuing target 5.5; terminal target 1.

Verify action indexing, tensor shapes, masks, discount powers, reward timing, successor identity, detached targets, and required actor-gradient paths.

Positive advantage should favor its sampled action under the minimizing loss convention; negative advantage should discourage it, subject to clipping.

## 4. Verify optimization on a tiny fixed batch

First fit fixed trusted targets on a tiny batch. Inspect finite gradients, actual weight changes, optimizer parameters, and gradient clearing.

Then reintroduce moving targets. For differentiable actor–critic updates, freeze critic weights but retain derivatives through action inputs.

## 5. Inspect information and exploration

Count action frequencies, visited regions, successes, and replay composition. More fitting cannot replace missing reward or recovery evidence.

Identical observations with incompatible outcomes suggest missing information. For recurrent failures, check memory, padding, and chunk boundaries.

## 6. Read diagnostics as a group

| Symptom | Plausible checks |
|---|---|
| Q-values grow while reward stays flat | Unsupported maximization, bad masks, unstable targets |
| Entropy collapses early | Large updates, weak exploration, misleading advantages |
| PPO KL rises sharply | Too many epochs, large learning rate, wrong old probabilities |
| Critic fits but policy fails | Objective mismatch, poor action gradient, weak coverage |
| Training reward rises but success falls | Reward loophole or metric disagreement |
| Only some seeds learn | Rare discoveries or unstable optimization |

Treat these symptoms as hypotheses, then test them against logged transitions and controlled experiments.

## 7. Distinguish scale from progress

Compare predicted values with the reward/discount bounds established earlier. Unexpected scale is a clue, not a diagnosis.

Critic loss may rise after discovering high rewards; entropy may fall during useful learning. Interpret metrics with behavior, episode length, and objective.

## 8. Use interventions that identify a cause

Freeze targets longer to probe target feedback. Use trusted toy rewards to isolate reward-model errors. Compare history-aware inputs to test state aliasing.

Change one mechanism, predict its effect, and compare matched budgets. Retain a stable baseline so seed noise does not masquerade as a fix.
