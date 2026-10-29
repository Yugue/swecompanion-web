# 3.1 Why learned value functions can become unstable

## 1. A prediction can become its own teacher

In supervised learning, a stored label often stays fixed. In bootstrapped value learning, the network helps generate the target it is trying to predict. Improving the predictor changes future targets.

With a table, changing one entry primarily changes that entry. With shared neural parameters, changing a prediction can alter many other states' and actions' values, including values used as targets.

## 2. The semi-gradient update

\[
y=r+\gamma Q_{\bar\theta}(s',a'),\qquad
\theta\leftarrow\theta+\eta(y-Q_\theta(s,a))\nabla_\theta Q_\theta(s,a)
\]

Theta is the trainable parameter vector, theta bar supplies the target prediction, eta is the step size, and a prime is the continuation action selected by the algorithm. Terminal targets omit the continuation.

A **semi-gradient** treats y as fixed during the update, even if its value ultimately depends on learned parameters. Detaching a target enforces that computational choice. It does not make the target correct or stationary across updates.

## 3. The deadly triad

| Ingredient | Why it can contribute |
|---|---|
| Function approximation | Parameters couple predictions across inputs |
| Bootstrapping | Targets depend on current predictions |
| Off-policy learning | Updated inputs can differ from the target behavior's distribution |

Their combination is known as the **deadly triad**. It identifies a setting in which divergence can occur, not a claim that all such methods always fail. Many useful deep algorithms intentionally operate in this setting with safeguards.

## 4. A simple error-amplification example

Consider a fixed zero-reward dataset containing only a nonterminal transition s→s prime. A scalar approximator predicts Q(s)=w and Q(s prime)=2w. With gamma=0.9, a semi-gradient update on s and learning rate 0.1 gives:

\[
w_{\mathrm{new}}=w+0.1(0.9\cdot2w-w)=1.08w
\]

Starting from w=1, repeated updates give 1.08, 1.1664, and continued growth. Zero values would fit a zero-return task, but unsupported successor estimates amplify themselves through shared parameters.

This example deliberately lacks successor-state training coverage. It illustrates the mechanism rather than proving divergence under adequate tabular coverage assumptions.

## 5. A small training error can hide a bad solution

```text
optimistic successor estimate → larger target → larger fitted value
              ↑                          ↓
              └──── shared parameters ───┘
```

The learner can chase targets that move upward as it fits them. Alternatively, it may fit an internally consistent but poorly supported set of predictions. Evaluate held-out behavior and value scale alongside loss.

For reward magnitude bounded by Rmax in a discounted task, absolute true values are bounded by Rmax/(1−gamma). Predictions greatly beyond that range deserve investigation, although regularized objectives can have different bounds.

## 6. Why familiar safeguards help

A target network slows the feedback loop. Replay broadens reuse and weakens immediate temporal correlations. Conservative updates, smaller learning rates, appropriate normalization, and gradient clipping can reduce amplification.

None supplies missing environmental evidence. Replay can repeatedly train on a narrow dataset, a frozen target can be wrong, and clipped gradients can keep fitting a misspecified objective indefinitely.

## 7. Distinguish instability from ordinary uncertainty

Large Temporal-Difference (TD) errors may reflect rare real rewards, changing policies, bad episode masks, or a divergent predictor. Check the environment and target computation before attributing every fluctuation to the algorithm family.

Monitor actual return, prediction ranges, target ranges, gradient norms, state-action coverage, and behavior changes. A value-network loss has no universal interpretation without its data and target definition.
