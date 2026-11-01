# Gradient descent

Backpropagation computes gradients. Gradient descent uses them to update parameters toward lower loss.

## 1. Take a small downhill step

\[
\theta_{new}=\theta-\eta\nabla_\theta L
\]

Here θ is the parameter vector, ∇L its loss gradient, and η the learning rate. A positive coordinate gradient decreases that parameter; a negative one increases it.

Picture walking downhill in fog. The slope tells you which direction descends nearby, but it does not reveal the entire landscape.

```dl-visual
gradient-descent
```

## 2. Calculate one update

Let L(w)=(w−3)². At w=0, the gradient is 2(w−3)=−6.

| Learning rate | New w | New loss |
|---|---|---|
| 0.1 | 0.6 | 5.76 |
| 0.5 | 3 | 0 |
| 1.1 | 6.6 | 12.96 |

The initial loss was 9. The last step follows the correct local direction but overshoots far enough to make the loss worse. The rate 0.5 reaches the minimum in this particular quadratic; it is not a general recommendation.

## 3. Distinguish a step from a training run

A gradient describes the objective at the current parameters. Recompute it after updating. For mini-batch training, each batch supplies a noisy estimate of the full-data gradient, so individual steps need not reduce full-data loss.

A flat trace can mean tiny steps, a nearly stationary point, or a broken training pipeline. An oscillating trace can suggest overly large steps. Check gradients and parameter changes before diagnosing from the curve alone.

## 4. Know the limit of the method

Deep-network losses are generally nonconvex. Gradient descent does not guarantee the best global solution. Momentum and adaptive optimizers change how gradients produce updates; schedules change the learning rate over time. They build on this update idea rather than replacing differentiation.
