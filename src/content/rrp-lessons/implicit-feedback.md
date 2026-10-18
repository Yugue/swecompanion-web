## Implicit feedback and its biases

## 1. Behavior is evidence about preference

**Implicit feedback** is behavior such as clicking, watching, or purchasing. **Explicit feedback** directly states an evaluation, such as a rating or thumbs-down.

Neither gives a complete account of what a person wants.

## 2. Choose the meaning of each signal

| Signal | What it records | Possible mismatch |
|---|---|---|
| Click | Opening an item | Curiosity or misleading presentation |
| Watch duration | Time spent viewing | Autoplay or item length |
| Purchase | A transaction | Later return or regret |
| Complaint | A reported problem | Only some users report |

A deeper event is not automatically a better target.

## 3. Non-clicks mix different situations

Suppose 1,000 displayed tiles contain:

```text
700 not examined + 270 examined without clicking + 30 clicked
```

The log has 970 non-clicks. Click records alone cannot separate the first two groups.

A non-click can label “no click under this display” without proving intrinsic irrelevance.

## 4. Distinguish the biases

- **Exposure bias:** selection controls which outcomes can be observed.
- **Position bias:** placement changes examination or clicking.
- **Popularity bias:** data or decisions favor already popular items.

These mechanisms can coexist. Their dedicated chapters examine correction and feedback.

## 5. Use a proxy deliberately

A **proxy** is a measurable substitute for the outcome you care about. Clicks can proxy interest, while useful viewing and complaints test where that substitute fails.

Write down the mismatch before choosing the training label.

## 6. Collect evidence that can test it

Log displays, placements, outcomes, and serving-policy versions. Randomized comparisons can help separate preference from presentation.

> Read behavior together with the opportunity that produced it.

## 7. Interview reasoning

**Question:** A thumbnail change increases clicks. Has recommendation quality improved?

**Answer:** It increased opening behavior. Check subsequent useful viewing, dissatisfaction, and a suitable experiment before claiming greater user benefit.
