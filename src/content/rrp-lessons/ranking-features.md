## Features for ranking

## 1. Describe the candidate in this request

**Ranking features** are inputs used to score a candidate. They can describe the user, item, current context, or their relationship.

## 2. Separate four families

| Family | Example |
|---|---|
| User | Language, subscriptions |
| Item | Category, creator, duration |
| Context | Query, device, time |
| Cross | User–creator watch count |

A **feature cross** represents a combination or relationship between inputs. It can be explicitly computed or learned by the model.

## 3. Use joint information where it fits

A ranker can fetch a candidate-specific user–creator count. This is the joint input excluded by the independent precomputation path in two-tower retrieval.

Keep expensive lookups for the smaller pool where their measured value justifies them.

## 4. Stabilize sparse rates

A **smoothed rate** blends observed counts with a reference:

\[
\hat p=\frac{c+\alpha p_0}{n+\alpha}
\]

\(c\): clicks; \(n\): impressions; \(p_0\): reference CTR; \(\alpha>0\): reference strength; \(\hat p\): estimate.

At \(c=n=1\), \(p_0=0.05\), \(\alpha=20\), the result is **2/21 ≈ 9.5%**, rather than raw 100%.

## 5. Keep support and time scope

Include counts: 10% from ten impressions differs from 10% from ten thousand.

Recent actions may reveal intent; longer windows stabilize evidence. Fit windows and reference statistics without including an example's own later outcome.

## 6. Make each feature earn its dependency

Use ablations to compare quality with and without a feature. Measure missing-value behavior, fetch latency, and update needs.

The features-and-freshness chapter explains consistent historical reconstruction and live computation.

## 7. Interview reasoning

**Question:** A creator has one click from one display. Should its 100% CTR dominate?

**Answer:** No. Supply support counts and a validated smoothing method so one observation does not appear as strong evidence of a perfect rate.
