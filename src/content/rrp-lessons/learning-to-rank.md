## Learning to rank

**Learning to rank** fits scores or selection rules for ordering candidates. Pointwise, pairwise, and listwise objectives differ in the training unit they compare.

## 1. Three views of the same request

```rrp-visual
ranking-objectives
```

- **Pointwise:** predict an outcome or relevance grade for each candidate, then sort scores.
- **Pairwise:** encourage a preferred candidate to score above another in the same comparison context.
- **Listwise:** use a loss defined over a request's candidate list, often as a surrogate for desired list quality.

These are objective families, not a universal quality ladder. A well-specified pointwise probability model can provide a strong ranking.

## 2. Pairwise loss still reacts to correct pairs

For preferred item \(i\), alternative \(j\), and scores \(s_i,s_j\), a common loss is:

\[
\ell=\log(1+e^{-(s_i-s_j)})
\]

A gap of +1 costs about 0.313; −1 costs about 1.313. The loss decreases as the preferred item moves farther ahead. Correctly ordered pairs still have nonzero loss and gradients.

A common score offset cancels in the difference. That does not remove position, exposure, or audience biases in how the preferences were observed.

## 3. Keep the intended group and metric

A **query group** contains candidates competing for one request. Comparing a clicked pasta video from a cooking query with an unclicked motorbike result from another query creates a different task.

Raw sorting metrics change discontinuously as scores move. Listwise methods can use differentiable probability losses or other surrogates. Some pairwise gradient methods weight swaps by their effect on NDCG; metric weighting is not exclusive to listwise learning.

For graded relevance, define the gain function and reference set. For click labels, account for how examination affected the observed comparison. A clicked item and an unexamined one do not supply certain relevance order.

## 4. Choose by what the score must do

A pure pairwise score has no automatic probability interpretation. If downstream logic uses expected value, add and validate a probability-estimation or calibration stage; it need not require discarding every ranking objective.

Evaluate the complete procedure with the same candidate pool, important slices, and serving budget. A better ordering of a fixed shortlist does not establish better full-catalogue discovery.

> **Mental image:** pointwise grades each answer, pairwise compares two answers, and listwise judges a whole submitted set. The quality of the evidence still matters in all three.
