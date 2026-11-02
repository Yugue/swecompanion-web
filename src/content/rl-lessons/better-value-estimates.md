# 3.3 Better value estimates: maximization bias and selective replay

## 1. Maximization can turn noise into optimism

Two actions have true value zero but noisy unbiased estimates. Choosing the larger estimate preferentially selects positive noise.

This **maximization bias** makes the expected maximum optimistic. Bootstrapping can propagate it.

## 2. Separate selection from evaluation

**Double Q-learning** separates action selection from evaluation. **Double DQN** uses DQN’s online and target networks for these separate jobs:

\[
a^*=\arg\max_a Q_\theta(s',a),\qquad
y=r+\gamma(1-d)Q_{\bar\theta}(s',a^*)
\]

θ selects action a* at successor s′; θ̄ evaluates it. r is reward, γ discount, and d genuine termination.

## 3. A target comparison

Online values [5,4] select action zero. Target values [2,6] evaluate it as 2; ordinary DQN instead uses maximum target value 6.

This demonstrates the operation, not which estimate is correct. Correlated networks need not produce unbiased or conservative values.

```python
next_action = online_net(next_states).argmax(dim=1)
next_value = target_net(next_states).gather(1, next_action[:, None]).squeeze(1)
```

Construct this target without gradient recording.

## 4. Not every stored transition is equally informative

**Prioritized experience replay** samples some stored transitions more often, commonly using absolute TD error as a priority.

High error may indicate useful underlearned evidence, noise, or a broken target. Priority is a heuristic for learning value.

## 5. Priority changes the sampled objective

Priorities change replay probabilities and therefore the training average:

\[
P(i)=\frac{(|\delta_i|+\varepsilon)^{\alpha_p}}
{\sum_j(|\delta_j|+\varepsilon)^{\alpha_p}},\qquad
w_i=\left(NP(i)\right)^{-\beta}
\]

P(i) is sampling probability; δᵢ stored TD error; ε a positive floor; αₚ priority strength; N buffer size; β correction strength. wᵢ is a loss weight.

αₚ=0 gives uniform sampling. β=1 corrects to the uniform-buffer average before optional normalization; smaller β retains priority bias. This corrects replay sampling, not all behavior-policy mismatch.

## 6. Numerical weight intuition

With N=100 and P(i)=0.04, sample i appears four times as often as under uniform replay. At β=1 its weight is 0.25.

Its expected contribution becomes 0.04×0.25=0.01. Normalizing weights changes gradient scale; it does not add coverage.

## 7. Compare the two mechanisms

| Mechanism | Main problem addressed | Does not establish |
|---|---|---|
| Double DQN | Selection-induced target optimism | Correct uncertainty or safe values |
| Prioritized replay | Unequal usefulness of stored samples | Reliable priorities or broad exploration |
| Importance weights | Nonuniform replay sampling | Correct full target-policy trajectory distribution |

Double estimation and prioritized replay address different problems and can be combined. Repeatedly prioritizing noise can reduce useful sample diversity.
