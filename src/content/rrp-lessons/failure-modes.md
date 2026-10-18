## Characteristic failure modes

## 1. Turn a symptom into a test

A **failure mode** is a recurring way the system misses its intended behavior. “The feed feels repetitive” names a symptom, not its cause.

> Trace a missing parcel through its handoffs before replacing the delivery truck.

## 2. Preserve one affected request

Retain intermediate item IDs, inputs, versions, removal reasons, and fallback use.

```text
inputs → eligible pool → retrieved IDs → scores → final list → rendered items
```

Inspect the actual display, not only the server's intended response.

## 3. Choose a discriminating check

| Symptom | First useful distinction |
|---|---|
| New items invisible | Missing from index or removed later? |
| Same items everywhere | Genuine demand or shared-cache/merge error? |
| Good offline, weak live | Evaluation mismatch or served-input mismatch? |
| Sudden click drop | Real outcome change or missing events? |

Each check should separate competing explanations.

## 4. Read counts before rates

A stable new-item click rate can hide a rapidly growing inventory denominator. Fewer clicks can reflect fewer recorded impressions or a broken collector.

Verify definitions, volumes, and linkage before interpreting quality changes.

## 5. Distinguish legitimate repetition

Repeated IDs can be an accidental merge bug. Familiar content can also be correct for resume-watching or replenishment.

For similar but distinct items, inspect candidate variety and list-selection rules. For stale session intent, inspect history freshness and truncation.

## 6. Recover, then isolate the repair

Use a valid fallback or compatible previous bundle during an incident. Preserve evidence.

Reproduce the failure and change the implicated component. Check the affected stage, broader quality, eligibility, and latency after repair.

## 7. Interview reasoning

**Question:** Recorded clicks fall suddenly while rendered recommendations appear unchanged. What do you check?

**Answer:** Verify impression and outcome collection, event linkage, and arrival delays before concluding the recommendations became worse.
