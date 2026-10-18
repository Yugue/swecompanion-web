## Users, items, and the interaction table

## 1. Record events before summarizing them

An **interaction log** records who did what to which item and when. An **impression** is a display opportunity; an **engagement** is an action such as a click or purchase.

## 2. Repeated displays are separate examples

| Impression | User / item | Display | Clicked |
|---|---|---|---|
| r1 | Ann / A | 09:00 | 0 |
| r2 | Ann / A | 18:00 | 1 |

The labels describe two opportunities, not contradictory permanent opinions about A.

## 3. A matrix compresses the log

An **interaction matrix** puts users in rows and items in columns. Each cell summarizes their events over a defined period.

```rrp-visual
interaction-matrix
```

**Sparse** means most pairs have no recorded events. Unknown exposure and displayed non-clicks must remain distinguishable.

> The log is a film; the matrix is a compressed snapshot.

## 4. Display does not establish attention

A **viewability event** records whether a tile entered the visible screen. A displayed or viewable tile may still go unnoticed.

Keep the display, visibility, and engagement records separate when those observations are available.

## 5. Join an outcome to an opportunity

An **observation window** defines when an outcome counts, such as a click within 30 minutes. Stable impression IDs connect the records.

For several displays followed by one purchase, **attribution** specifies which display receives credit. That convention does not prove causation.

## 6. Preserve timing and context

**Event time** is when an action happened; **arrival time** is when the pipeline received it.

Store query, device, and other relevant context. Finalize a non-click label only after its observation window and accepted arrival delay.

## 7. Interview reasoning

**Question:** Why keep impression IDs if user and item IDs already exist?

**Answer:** The same pair can appear repeatedly under different conditions. An impression ID identifies the opportunity to which a time-bounded outcome belongs.
