## Features for ranking

**Ranking features** describe candidates and their relevance to a particular request. The most useful family depends on the task; explicit crosses are one way to represent relationships, not the only source of personalization.

## 1. Four feature families

| Family | Example | Information supplied |
|---|---|---|
| User | Language, subscriptions, long-run interests | Who is asking |
| Item | Category, creator, duration, availability | What is being considered |
| Context | Query, device, surface, time | The current decision |
| Cross | User–creator watch count, price compatibility | A candidate-specific relationship |

A model can learn interactions between separate user and item inputs. A joint ranker additionally permits arbitrary candidate-specific lookups that an independently computed two-tower representation cannot directly consume.

## 2. Use rates with their support

One click from one impression gives raw CTR 100%, but very little evidence. A **smoothed rate** blends observations with a reference:

\[
\hat p=\frac{clicks+\alpha p_0}{impressions+\alpha}
\]

With reference \(p_0=0.05\), strength \(\alpha=20\), and one click from one impression, the value is \(2/21\approx9.5\%\).

Include counts as well. A 10% rate from ten exposures is less established than one from ten thousand. Fit reference statistics from allowed historical data and avoid including the target outcome in its own features.

## 3. Choose windows and availability deliberately

Recent category actions can reveal a changing intent; longer histories can stabilize sparse evidence. Compare several windows rather than assuming recency always wins.

For a 14:00 decision, a 14:20 purchase can become a label but cannot enter its inputs. Historical aggregates must use events already available at 14:00, including arrival delays.

Observed final position predicts clicks, but is determined by the selection process. A model using position to estimate display-conditioned behavior needs a deliberate serving convention and validation; copying the old output position into a candidate's intrinsic relevance input is a shortcut.

## 4. Make each feature earn its dependency

An **ablation** tests a component by comparing a suitable procedure with and without it. Evaluate repeatable quality gains, key slices, retrieval or fetch latency, missing behavior, and freshness requirements.

Log values or versioned snapshots used during serving and compare them with historical reconstruction. Shared definitions help prevent **train/serve skew**, a mismatch between training and live feature computation.

Keep a costly feature when its measured value justifies that cost, rather than because its name sounds personalized.
