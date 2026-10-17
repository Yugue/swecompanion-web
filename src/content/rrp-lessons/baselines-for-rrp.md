## Baselines worth beating

A **baseline** is a reference method evaluated under the same conditions as a candidate. In recommendation, simple popularity, history, and co-occurrence rules can be strong references.

## 1. Build a useful comparison ladder

| Reference | Mechanism | Limitation to test |
|---|---|---|
| Popularity | Most engaged-with eligible items | Counts reflect exposure and age |
| Contextual popularity | Popular within a region, query, or category | Small segments can be noisy |
| Recency | Recently published eligible items | New does not imply useful |
| Personal history | Continue watching or buy again | Wrong for some discovery tasks |
| Item co-occurrence | Items consumed alongside recent history | Sparse overlaps and popularity effects |

The current production system is another important baseline, even if it is complex. It is the process a new candidate must improve or replace.

## 2. Read the gain with its costs

Suppose the same evaluation gives:

```text
popularity-in-context       recall@100 = 0.24
history plus co-occurrence              = 0.29
learned retrieval                      = 0.31
```

The learned candidate gains 0.02, or two percentage points, over the stronger simple reference. Whether that matters depends on uncertainty, traffic, useful discoveries, latency, and maintenance.

A small gain does not automatically mean weak personalization or a broken model. The baseline may already be good, the labels incomplete, or the improvement valuable only in specific slices.

## 3. Keep the comparison fair

Use the same eligible inventory, request set, list length, duplicate rules, and outcome window. Build popularity from events available before the evaluation decision, not tomorrow's clicks.

If a baseline uses only known items while a candidate can introduce new ones, report that coverage difference explicitly. Missing labels for discoveries make a logged metric incomplete evidence about their value.

For uncertain comparisons, inspect paired per-user or per-request differences with a method that respects dependence. A score improvement alone does not establish the causal benefit of personalization; the systems may differ in several ways.

## 4. Keep a reference available in operation

A cached popularity or curated list can provide a fallback when a learned system is unavailable. It still needs current eligibility checks and an expiration policy.

Monitor the reference and candidate under comparable traffic. A sudden relative regression can suggest broken data or serving behavior, but is a diagnostic cue rather than proof of one cause.

> **Mental image:** each rung shows what added complexity buys over a credible alternative. Measure the next rung, not just the height above the floor.
