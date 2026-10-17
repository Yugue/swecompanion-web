## Collaborative filtering

**Collaborative filtering** uses patterns of user–item behavior to recommend items. Neighborhood methods compare users or items; latent-factor methods learn a shared representation from interactions.

The signal is who consumed what, rather than requiring a description of what each item contains.

## 1. Follow shared behavior

```rrp-visual
collaborative-neighbors
```

Suppose Ann consumed A and B, Ben consumed A, B, and C, and Cara consumed A. Ann and Ben provide evidence for suggesting B to Cara. Their behavior also suggests C, with less direct support in this tiny example.

A recommendation is a hypothesis, not proof that Cara will like either item. Co-consumption can reflect prior placement, popularity, or availability.

## 2. User-based and item-based routes

- **User-based:** find similar user histories, then score items those neighbors consumed.
- **Item-based:** find items co-consumed with the user's history, then combine those neighbor lists.

For item-based scoring, candidate D might have similarity 0.6 to one recent item and 0.3 to another. A simple summed score is 0.9. Recency, history length, and repeated events can change the weighting.

**Co-occurrence** counts how often two items appear in a defined observation unit, such as distinct users or sessions. State that unit; repeated refreshes should not silently count as many independent preferences.

## 3. Precomputation is a practical benefit

Item-neighbor lists can be built ahead of time and fetched when a history item appears. User-neighbor lists can also be precomputed. Which is easier depends on entity counts, changing behavior, catalogue turnover, and refresh requirements.

Item relationships are not permanently stable. A news catalogue may change faster than a user's broad interests. Choose the refresh window from evidence rather than assuming “item-based is always more stable.”

## 4. Sparse and biased evidence limits the method

Popular items overlap with many histories and can dominate raw counts. Normalize similarities and inspect support. A shared audience of one person is weaker evidence than hundreds, even when a normalized score is identical.

Pure interaction-only methods have limited personalized evidence for unseen users or items. Blend side features and suitable fallbacks rather than interpreting no interaction history as low quality.

Removing already consumed items is surface-specific: useful for some discovery tasks, wrong for continue-watching or replenishment purchases.

> **Mental image:** follow paths through a user–item graph. A path reveals shared behavior, while its reliability depends on how those edges were observed.
