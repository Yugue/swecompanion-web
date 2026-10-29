# 1.2 Probability and estimation for learning from experience

## 1. Distinguish two kinds of uncertainty

A robot's wheel can slip even when its dynamics are well understood. That is randomness in the outcome. Having observed a surface only twice creates uncertainty about its slip probability.

More observations can reduce uncertainty in the estimated probability without removing the underlying randomness. This distinction later explains why exploration should target missing knowledge rather than merely noisy outcomes.

## 2. Random variables and conditional probabilities

A **random variable** assigns a quantity to an uncertain outcome. A distribution assigns probabilities to its possible values. For a discrete variable X, probabilities are nonnegative and sum to one.

A conditional probability P(Y=y given X=x) describes outcomes after conditioning on information. In RL, an action distribution conditions on the available state; a transition distribution conditions on a state and action. Those are different distributions even when both involve the same trajectory.

## 3. Expectations are weighted averages

\[
\mathbb E[X]=\sum_x p(x)x,\qquad
\mathbb E[X]=\mathbb E_Z[\mathbb E[X\mid Z]]
\]

Here p(x) is the probability of value x; Z is another random variable used to divide the outcomes into cases. The second expression is the **law of total expectation**: average within each case, then average across cases.

A reward is 10 with probability 0.2 and −1 otherwise. Its expected reward is 0.2 × 10 + 0.8 × (−1) = 1.2. No single trial needs to produce 1.2. The nested averaging rule will become the basis of Bellman equations.

## 4. Estimate expectations from samples

\[
\bar X_N=\frac1N\sum_{i=1}^N X_i,\qquad
\operatorname{Var}(\bar X_N)=\frac{\sigma^2}{N}
\]

N is the sample count and sigma squared is the variance of each observation. The variance formula assumes independent samples with the same variance. Sequential transitions are generally correlated, so treating them as independent overstates the effective sample size.

Variance measures spread around an expectation. **Bias** is the difference between an estimator's expectation and the desired quantity. A low-variance estimator can be consistently wrong; an unbiased estimator can be too noisy to use.

## 5. Policies need discrete and continuous distributions

A **categorical distribution** selects one of a finite set of actions. **Softmax** converts real scores z into probabilities:

\[
p_i=\frac{e^{z_i}}{\sum_j e^{z_j}}
\]

A **Gaussian distribution** describes a continuous scalar using mean mu and standard deviation sigma. Its probability density can exceed one; probability is the integral over a region, not the density at one point. For independent action coordinates, a diagonal Gaussian uses a separate mean and variance per coordinate.

## 6. Likelihoods and log probabilities

A **likelihood** treats the observed outcomes as fixed and asks how plausible they are under a model's parameters. Independent probabilities multiply; their logarithms add. Log probabilities are useful for numerical stability and policy learning.

Bayes' rule combines a prior belief about a hypothesis with the likelihood of observed data to form a posterior. In bandits, a posterior over an action's unknown reward parameter represents uncertainty about what that action is worth.

```python
mean_return = sum(episode_returns) / len(episode_returns)
log_trajectory_prob = sum(action_log_probs)
```

The second line covers action probabilities only; environment and initial-state probabilities are separate factors in a full trajectory probability.

## 7. Compare estimates honestly

| Observation | What it establishes |
|---|---|
| High mean after two trials | Very limited evidence |
| High mean with large outcome spread | Potentially unreliable individual outcomes |
| Many correlated transitions | Less independent evidence than the count suggests |
| Narrow interval on biased data | Precision under the wrong sampling assumptions |

A standard error describes uncertainty in an estimated mean under assumptions. It is different from the standard deviation of outcomes.
