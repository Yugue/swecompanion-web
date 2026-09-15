## Data and label quality

A model is only as good as its labels. Interviewers probe this early because it's where most real-world ML systems actually fail - not in the model architecture, but in what the model was trained to believe was true.

### Where labels come from

Three common sources, each with a different failure mode:

- **Human annotation** - accurate in principle, expensive, and slow to scale. Inter-annotator disagreement is itself a signal about label quality; if two labelers disagree 20% of the time, no model can beat that ceiling.
- **Implicit signal** - clicks, purchases, dwell time, thumbs up. Cheap and scalable, but it's a proxy for the thing you actually want (a click is not the same as satisfaction), and it's biased by what the system already showed the user.
- **Downstream outcome** - chargebacks, refunds, churn events. Often the most trustworthy signal, but usually the slowest to arrive (see label delay, below).

### Exposure bias in implicit labels

If your recommendation system only ever showed users items ranked by an existing model, your "did the user click" labels only tell you about items that model already favored. Items the current system never surfaced get no signal at all - not "the user didn't like it," just "the user never saw it."

\[
P(\text{click} \mid \text{item}) \text{ is only observed for items the current system already exposed}
\]

This is why production recommender systems often inject some randomization or exploration into what's shown, purely to collect unbiased labels for future training - a direct example of the ML lifecycle feeding back into the data collection design.

### Leakage: the most common silent bug

Leakage means the model has access, during training, to information that would not legitimately be available at prediction time. It's silent because it makes offline metrics look great right up until the model is deployed and performs far worse.

Two common shapes:

1. **Feature leakage** - a feature is only populated after the label is known. Classic example: including `account_closed_due_to_fraud` as a feature when predicting fraud - it only exists because fraud already happened.
2. **Preprocessing leakage** - computing normalization statistics (mean, std, min/max) over the *entire* dataset before splitting into train/test. The test set's information leaks into the training-time statistics.

> A good habit: fit any preprocessing (scalers, encoders, imputers) only on the training split, then apply the fitted transform to validation and test - never fit on data the model isn't supposed to have seen yet.

### Label delay drives the rest of the design

The gap between an event and its ground truth becoming known determines how fast you can:

- validate a newly trained model against real outcomes,
- detect that the model has started failing,
- and retrain.

| Domain | Typical label delay | Consequence |
|---|---|---|
| Ad click prediction | seconds to minutes | can validate and retrain almost continuously |
| Churn prediction | weeks | monthly retraining cadence is often the practical ceiling |
| Credit default | months to years | must rely heavily on proxy metrics and offline validation between rare true-label refreshes |
| Fraud (chargeback-based) | 60-90 days | today's "confirmed clean" transactions may still flip to fraud later - training data has to account for this |

That last row matters more than it looks: if you naively label "no chargeback yet" as "not fraud," you're mislabeling transactions that are fraudulent but haven't been reported yet. The correct approach is usually to only use transactions old enough that their outcome has had time to fully resolve, accepting a training-data lag in exchange for label correctness.

### What to say in an interview

When a prompt doesn't specify where labels come from, ask. Then explicitly flag:

- what bias the label source introduces (exposure bias, annotation noise, definitional fuzziness),
- what leakage risk exists given how the label is defined,
- and how the label's delay constrains your retraining and monitoring design later in the answer.

Getting this right early prevents you from designing an elegant model and serving architecture on top of a data foundation that can't support it.
