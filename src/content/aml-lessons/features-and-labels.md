## Features, labels, and a training example

## 1. Define one example

A **training example** is one input used for learning. **Features** describe that input; the **label** is its supervised target.

For a checkout delivery estimate, one example is one order:

| Distance | Historical prep time | Delivery label |
|---|---|---|
| 2.4 km | 11 min | 34 min |
| 5.1 km | 26 min | 58 min |

## 2. Arrange the table

A **design matrix** stores examples as rows and numeric features as columns:

\[
X\in\mathbb R^{n\times d},\qquad y\in\mathbb R^n
\]

\(X\) holds the features, \(y\) one numeric label per row, \(n\) the example count, and \(d\) the feature count. Multiple targets or image inputs need different shapes.

## 3. Seal inputs at prediction time

```text
available history → checkout: predict → delivery → label becomes known
```

A request may supply features at checkout. A courier assigned afterward is unavailable for that prediction.

**Data leakage** means using information unavailable in the claimed prediction or evaluation setting. Historical inputs must respect data arrival and correction times too.

## 4. Make the label reproducible

Replace “churn” with a specific outcome:

```text
unit:       active subscriber scored each Monday
label:      no sessions in the next 30 days
known:      after 30 days plus reporting delay
```

Ten observed days cannot establish a negative 30-day label.

## 5. Check the product contract

“One row per user” differs from “one row per user per week.” The choice changes labels, dependence between rows, and evaluation.

Every feature must also be available within the live decision's time budget. Today's warehouse contents do not establish historical availability.

## 6. Interview reasoning

**Question:** Can a checkout ETA model use the courier's eventual arrival time at the restaurant?

**Answer:** No. That future event is unavailable at checkout. Use information known then, such as historical preparation estimates.
