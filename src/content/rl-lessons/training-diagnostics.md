# 6.4 Diagnosing failed or unstable training

## 1. Debug from observable facts

A flat reward curve can mean a broken environment, a poor reward, missing exploration, wrong targets, or failed optimization. Changing multiple hyperparameters at once makes those explanations harder to distinguish.

Start with the smallest controlled environment that exercises the mechanism. A deterministic two-state problem can reveal a target error much faster than another expensive full-task run.

## 2. Verify the environment and reward first

Run a random policy and a simple hand-written or known-good policy. Inspect actions, rewards, episode lengths, success labels, and actual trajectories. Confirm that the known-good behavior can receive the expected outcome.

If no feasible behavior succeeds, investigate task reachability, action scaling, reset conditions, and reward computation. A sophisticated optimizer cannot fix an impossible or incorrectly instrumented task.

## 3. Check numerical targets by hand

Use transitions with known values. With reward=1, gamma=0.9, and continuation=5, a continuing target is 5.5 and a genuinely terminal target is 1.

Verify that selected action values, batch dimensions, masks, discount powers, and reward timing match the equations. Inspect whether replay successors belong to the right episode. Confirm detached targets and intended actor-gradient paths.

For a policy loss, positive advantage should favor the sampled action under the chosen minimizing sign convention; negative advantage should discourage it, subject to clipping or other regularization.

## 4. Verify optimization on a tiny fixed batch

Can a small value network reduce loss on fixed trusted targets? Are gradients finite and nonzero in the expected parameters? Does the optimizer receive the right parameter set and clear accumulated gradients?

Do not require a bootstrap learner's moving loss to behave like fixed-label regression. First isolate that simpler case. In an actor update, hold critic parameters fixed while retaining derivatives through its action input where the algorithm requires them.

## 5. Inspect information and exploration

Count action frequencies, visited regions, successful trajectories, and replay composition. If the buffer contains no informative reward or recovery states, more fitting may only sharpen unsupported guesses.

Repeated identical observations with incompatible outcomes can indicate partial observability or missing timestamps. Recurrent hidden states, padding masks, and sequence boundaries are especially important when failures occur only in batched or chunked execution.

## 6. Read diagnostics as a group

| Symptom | Plausible checks |
|---|---|
| Q-values grow while reward stays flat | Unsupported maximization, bad masks, unstable targets |
| Entropy collapses early | Large updates, weak exploration, misleading advantages |
| PPO KL rises sharply | Too many epochs, large learning rate, wrong old probabilities |
| Critic fits but policy fails | Objective mismatch, poor action gradient, weak coverage |
| Training reward rises but success falls | Reward loophole or metric disagreement |
| Only some seeds learn | Rare discoveries or unstable optimization |

These are hypotheses, not one-to-one diagnoses. Validate each against logged transitions and controlled experiments.

## 7. Distinguish scale from progress

For bounded rewards of magnitude at most Rmax and gamma below one, unregularized true values cannot exceed Rmax/(1−gamma) in absolute magnitude. Predictions outside a plausible range are a useful clue.

Critic loss can rise when a policy first discovers useful high rewards. Entropy can decline as a policy legitimately becomes confident. A return curve can move because episode length changed. Interpret each metric alongside task behavior and the objective definition.

## 8. Use interventions that identify a cause

Freeze the target network longer to probe moving-target feedback. Replace learned rewards with a trusted toy reward to isolate reward-model issues. Train on a tiny solvable task to separate implementation from task difficulty. Compare feed-forward and history-aware inputs when state aliasing is suspected.

Change one mechanism, state the expected outcome, and compare matched evaluation budgets. Retain a stable baseline; otherwise normal seed variation can masquerade as a successful fix.
