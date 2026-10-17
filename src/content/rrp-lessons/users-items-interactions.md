## Users, items, and the interaction table

An **interaction log** records who did what to which item, when, and in what context. An **impression** records a display opportunity; an **engagement event** records an action such as a click, watch, or purchase.

Keep those events separate so missing engagement can be interpreted correctly.

## 1. One display is one event

| Impression ID | User | Item | Display time | Click within 30 minutes |
|---|---|---|---|---|
| r1 | Ann | A | 09:00 | 0 |
| r2 | Ann | A | 18:00 | 1 |
| r3 | Ben | B | 18:05 | 0 |

Ann's two displays create two examples. They are not contradictory labels for one permanent user–item preference.

A **viewability event** can additionally record whether a tile entered the visible screen. Displayed, viewable, and examined by a person are related but different observations.

## 2. A matrix is a summary of the log

An **interaction matrix** places users in rows and items in columns. A cell summarizes events for a user–item pair under a chosen period and definition.

```rrp-visual
interaction-matrix
```

Large catalogues often make this matrix sparse: most user–item combinations have no events. The exact sparsity depends on the product and time window.

A blank could mean never displayed, unavailable, missing instrumentation, or no recorded action. Even an observed non-click does not prove dislike. Retain exposure evidence rather than collapsing every unknown into a negative label.

## 3. Join outcomes deliberately

Attach outcomes using stable impression or event keys. Define the label's **observation window**, such as click within 30 minutes. Wait for that window and the accepted arrival delay before assigning a completed negative.

**Event time** is when an action happened; **arrival time** is when the pipeline received it. A delayed click can otherwise be silently labelled a non-click.

If several displays precede one purchase, define **attribution**: which exposure, if any, receives the recorded outcome. Attribution is a labelling convention, not proof that the exposure caused the purchase.

## 4. Keep context and side information

User, item, and context tables provide attributes such as language, item category, query, device, and session history. Use only values available at the decision time.

These attributes also help with **cold start**: making recommendations for users or items with little interaction evidence.

> **Mental image:** the event log is the film; the user–item matrix is one compressed snapshot. Do not expect the snapshot to retain every exposure and timing detail.
