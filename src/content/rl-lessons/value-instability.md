# 3.1 Why learned value functions can become unstable

## 1. A prediction can become its own teacher

Bootstrapped learning helps generate its own targets. Changing a prediction therefore changes what later updates try to fit.

Shared parameters couple states and actions: fitting one value can alter successor values used as targets.

## 2. The semi-gradient update

A neural value update often treats its target as fixed:

\[
y=r+\gamma Q_{\bar\theta}(s',a'),\qquad
\theta\leftarrow\theta+\eta(y-Q_\theta(s,a))\nabla_\theta Q_\theta(s,a)
\]

θ is the trainable parameter vector; θ̄ supplies target values; η is step size; r reward; γ discount; a′ the algorithm’s continuation action. Omit continuation at genuine termination.

A **semi-gradient** ignores the target’s parameter dependence within this update. Detaching implements that choice; it does not make targets correct or fixed across updates.

## 3. The deadly triad

| Ingredient | Why it can contribute |
|---|---|
| Function approximation | Parameters couple predictions across inputs |
| Bootstrapping | Targets depend on current predictions |
| Off-policy learning | Updated inputs can differ from the target behavior's distribution |

The **deadly triad** combines these three ingredients. Divergence is possible, not inevitable; useful algorithms employ safeguards while operating in this setting.

## 4. A simple error-amplification example

A zero-reward dataset contains only nonterminal s→s′. Shared parameter w gives Q(s)=w and Q(s′)=2w. At γ=0.9 and step size 0.1:

\[
w_{\mathrm{new}}=w+0.1(0.9\cdot2w-w)=1.08w
\]

Starting at 1 gives 1.08, 1.1664, and further growth. Unsupported successor predictions amplify themselves.

The example lacks successor-state training coverage; it does not contradict tabular convergence under adequate coverage.

## 5. A small training error can hide a bad solution

```text
optimistic successor estimate → larger target → larger fitted value
              ↑                          ↓
              └──── shared parameters ───┘
```

Prediction and target can drift upward together, or settle into mutually consistent unsupported estimates. Inspect behavior and value scale alongside loss.

For rewards bounded in magnitude by Rmax and γ<1, unregularized true values satisfy |V|≤Rmax/(1−γ). Much larger predictions warrant investigation.

## 6. Why familiar safeguards help

A target network slows target changes. Replay reduces immediate temporal correlation. Smaller updates and gradient clipping can limit amplification.

These controls do not supply missing evidence: broad reuse of a narrow dataset still leaves unsupported predictions.

## 7. Distinguish instability from ordinary uncertainty

Large TD errors can reflect rare rewards, changed policies, wrong episode masks, or divergence. Check transitions and target code first.

Compare returns, prediction/target ranges, gradient norms, coverage, and behavior changes. Loss alone cannot distinguish these causes.
