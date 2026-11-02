# 1.2 Probability and estimation for learning from experience

## 1. Distinguish two kinds of uncertainty

Wheel slip is outcome randomness. Having tried a surface only twice creates uncertainty about its slip probability.

More trials reduce uncertainty about that probability; they need not remove slipping. Exploration should target missing knowledge, not merely noisy outcomes.

## 2. Random variables and conditional probabilities

A **random variable** assigns a quantity to an uncertain outcome. A **distribution** assigns probabilities; discrete probabilities are nonnegative and sum to one.

A **conditional probability** P(Y=y given X=x) uses known information X=x. Policy probabilities describe action choice; transition probabilities describe outcomes after a state and action.

## 3. Expectations are weighted averages

An **expectation** is a probability-weighted average. Here p(x) is the probability of value x; Z divides outcomes into cases. **Total expectation** averages within cases, then across cases.

\[
\mathbb E[X]=\sum_x p(x)x,\qquad
\mathbb E[X]=\mathbb E_Z[\mathbb E[X\mid Z]]
\]

Reward 10 with probability 0.2 and −1 otherwise has expectation 0.2×10+0.8×(−1)=1.2. No individual trial must equal 1.2.

## 4. Estimate expectations from samples

The **sample mean** estimates an expectation from observations:

\[
\bar X_N=\frac1N\sum_{i=1}^N X_i,\qquad
\operatorname{Var}(\bar X_N)=\frac{\sigma^2}{N}
\]

N is sample count, Xᵢ observation i, and σ² individual-outcome variance. **Variance** measures spread. The mean-variance formula assumes independent, equally variable samples; correlated transitions provide less evidence.

**Bias** is an estimator’s expected error. Low variance can coexist with systematic bias; unbiased estimates can still be too noisy to use.

## 5. Policies need discrete and continuous distributions

A **categorical distribution** chooses among discrete actions. **Softmax** converts scores zᵢ into action probabilities pᵢ; j indexes all actions. Raising one score relative to others raises its probability.

\[
p_i=\frac{e^{z_i}}{\sum_j e^{z_j}}
\]

A **Gaussian distribution** describes continuous outcomes using mean μ and standard deviation σ. Its **density** integrates to probability over a region; density itself can exceed one. A diagonal Gaussian models action coordinates independently.

## 6. Likelihoods and log probabilities

A **likelihood** measures how plausible observed data is under model parameters. Independent probabilities multiply; their logarithms add. **Log probabilities** help avoid numerical underflow.

**Bayes’ rule** updates a **prior** belief using observed-data likelihood to obtain a **posterior**. A bandit posterior can represent uncertainty about an action’s mean reward.

```python
mean_return = sum(episode_returns) / len(episode_returns)
log_trajectory_prob = sum(action_log_probs)
```

The trajectory snippet sums action log probabilities only. A full trajectory probability also includes initial conditions and environment outcomes.

## 7. Compare estimates honestly

| Observation | What it establishes |
|---|---|
| High mean after two trials | Very limited evidence |
| High mean with large outcome spread | Potentially unreliable individual outcomes |
| Many correlated transitions | Less independent evidence than the count suggests |
| Narrow interval on biased data | Precision under the wrong sampling assumptions |

A **standard error** describes uncertainty in an estimated mean under sampling assumptions. A **standard deviation** describes spread of outcomes.

Ten episodes from one trained policy measure different variation from ten independently trained policies. Keep episode randomness and training-run variation separate.
