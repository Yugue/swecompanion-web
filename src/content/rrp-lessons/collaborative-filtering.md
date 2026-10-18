## Collaborative filtering

## 1. Learn from shared behavior

**Collaborative filtering** recommends from patterns of user–item behavior. Its evidence is who consumed what, rather than item descriptions.

> Follow paths through a user–item graph.

## 2. See one recommendation path

```rrp-visual
collaborative-neighbors
```

Cara used A. Other A users also used B, providing evidence to suggest B to Cara.

That path is a recommendation hypothesis, not proof of preference.

## 3. Compare two neighborhood methods

A **neighborhood** is a selected set of similar users or items.

| Method | Request-time route |
|---|---|
| User-based | Similar histories → items those users consumed |
| Item-based | History items → their item neighbors |

The similarity chapter develops how to choose those neighbors.

## 4. Combine support from history

Suppose candidate D has similarities 0.6 and 0.3 to two history items. A simple summed score is **0.9**.

Weights can account for action strength or recency. Longer histories otherwise accumulate more contributions merely by having more entries.

## 5. Move repeated work ahead of requests

Precompute neighbor lists, then fetch them for history items or users.

Choose refresh frequency using actual change rates. News-item relationships can expire faster than broad user interests; item-based lists are not inherently more stable.

## 6. Handle sparse and selected evidence

Raw overlap can repeatedly favor bestsellers. Inspect overlap counts as well as normalized similarity.

Pure interaction methods have little evidence for unseen IDs. Use the cold-start strategies already introduced.

Removing consumed items is surface-specific: appropriate for some discovery pages, wrong for resume-watching or replenishment.

## 7. Interview reasoning

**Question:** Does sharing one history item justify a recommendation?

**Answer:** It supplies a possible path. Check overlap support, normalization, observation bias, and later recommendation quality before trusting that path strongly.
