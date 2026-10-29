# 3.3 Better value estimates: maximization bias and selective replay

## 1. Maximization can turn noise into optimism

Suppose two actions have equal true value zero. Each estimate is unbiased but noisy. Selecting whichever estimate happens to be larger preferentially selects positive estimation noise.

Thus the expectation of the maximum estimate can exceed the maximum true value. Repeatedly placing that maximum in bootstrapped targets can propagate overestimation.

## 2. Separate selection from evaluation

**Double Q-learning** uses separate estimates to reduce the coupling between selecting a maximizing action and evaluating it. **Double Deep Q-Network (Double DQN)** adapts that principle using the online and target networks already present in DQN.

\[
a^*=\arg\max_a Q_\theta(s',a),\qquad
y=r+\gamma(1-d)Q_{\bar\theta}(s',a^*)
\]

Theta selects the next action; theta bar evaluates that selected action. R, gamma, and d retain the reward, discount, and termination meanings from 3.2.

## 3. A target comparison

At a successor state, let online values be [5,4] and target values [2,6]. DQN's target continuation is max(2,6)=6. Double DQN selects action zero using [5,4] and evaluates it as 2.

This example shows the computation, not that 2 must be closer to the unknown truth. Online and target networks remain correlated, so Double DQN reduces a bias mechanism without guaranteeing unbiased or conservative predictions.

```python
next_action = online_net(next_states).argmax(dim=1)
next_value = target_net(next_states).gather(1, next_action[:, None]).squeeze(1)
```

Run target construction without gradient recording. Action selection and evaluation serve different roles even when network architectures match.

## 4. Not every stored transition is equally informative

Uniform replay spends equal expected effort on common easy transitions and rare surprising ones. **Prioritized experience replay** samples transitions using a proxy for learning value, often absolute Temporal-Difference (TD) error.

A large error can indicate an underlearned useful outcome. It can also indicate noise, outliers, incorrect boundary labels, or an impossible target. Priority is a heuristic, not a direct measurement of future policy improvement.

## 5. Priority changes the sampled objective

\[
P(i)=\frac{(|\delta_i|+\varepsilon)^{\alpha_p}}
{\sum_j(|\delta_j|+\varepsilon)^{\alpha_p}},\qquad
w_i=\left(NP(i)\right)^{-\beta}
\]

P is the replay sampling probability, delta the latest stored TD error, epsilon a positive floor, alpha subscript p the priority exponent, N the buffer size, and beta the correction exponent.

Alpha p=0 yields uniform sampling. Beta=1 supplies the inverse-probability correction for a uniform-buffer average, before optional weight normalization. Smaller beta leaves a biased emphasis on priorities. These correction weights address replay sampling, not every behavior-policy mismatch.

## 6. Numerical weight intuition

With N=100 and P(i)=0.04, the transition is sampled four times as often as under uniform replay. At beta=1 its unnormalized weight is 1/4.

In expectation, probability 0.04 times weight 0.25 restores its uniform contribution 0.01. Normalizing all weights by their maximum changes overall gradient scale; it does not supply additional coverage.

## 7. Compare the two mechanisms

| Mechanism | Main problem addressed | Does not establish |
|---|---|---|
| Double DQN | Selection-induced target optimism | Correct uncertainty or safe values |
| Prioritized replay | Unequal usefulness of stored samples | Reliable priorities or broad exploration |
| Importance weights | Nonuniform replay sampling | Correct full target-policy trajectory distribution |

Both mechanisms can be combined. Neither substitutes for a useful reward, valid target masks, or representative data. Repeatedly selecting noisy transitions can reduce effective diversity.
