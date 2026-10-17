## Features, labels, and a training example

A **training example** is one input the model learns from. **Features** describe that input; a **label** is the target to predict in supervised learning.

For a delivery estimate made at checkout, one example is one order:

| Distance | Historical prep time | Open orders | Label: delivery time |
|---|---|---|---|
| 2.4 km | 11 min | 6 | 34 min |
| 5.1 km | 26 min | 2 | 58 min |

The first three columns are available at checkout. The final column becomes known after delivery.

## 1. State what one row means

For tabular data, the **design matrix** \(X\) has one row per example and one column per feature:

\[
X\in\mathbb{R}^{n\times d},\qquad y\in\mathbb{R}^{n}
\]

Here \(n\) is the number of examples and \(d\) the number of numeric feature columns. This shape describes a single numeric target; images, sequences, and multiple targets need other shapes.

“One row per user” and “one row per user per Monday” create different datasets. Name the unit before designing features or splits.

## 2. Attach a prediction time

```text
past order history → checkout / prediction time t → delivery → label known
                     ↑
            every feature must be available here
```

An arriving request can supply features at \(t\); they need not exist strictly before it. A courier assigned after checkout is unavailable for this prediction, even if that courier is recorded in today's warehouse.

Using information unavailable at prediction time is **data leakage**. Reconstruct historical features as they were known then, including data arrival delays.

## 3. Define the label precisely

For churn, replace “customer churned” with a reproducible definition:

```text
unit:       active subscriber scored on Monday
label:      no sessions in the next 30 days
exclusion:  billing cancellations handled separately
available:  after the full 30-day window and reporting delay
```

A subscriber observed for only ten days has an incomplete outcome, not an automatic negative label.

## 4. Check availability in the product

A valid feature must be available within the serving budget, using the same definition used during training. A nightly score can use different data sources from an instant checkout decision.

Labels can be incomplete or noisy. A click means “clicked after being shown,” not “would prefer this over every unseen alternative.”

> **Mental image:** each row is a time capsule. Seal the input at prediction time; attach the outcome when it becomes observable.
