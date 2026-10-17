## What a recommender actually does

A **recommendation system** selects items likely to be useful for a person in a particular context. **Ranking** orders candidates; **personalization** adapts the selection or order using information about the user or session.

A video service may choose six videos from millions. A useful prediction score helps make that choice, but the product receives a list, not just a number.

## 1. Start with the surface

A **surface** is the place where recommendations appear.

| Surface | Decision | Example success criterion |
|---|---|---|
| Home feed | What to discover | Satisfied viewing or useful discovery |
| Search | What answers this query | Relevant results near the top |
| Up next | What follows this item | A useful continuation |
| Notification | Whether to interrupt at all | Useful opens without unwanted interruptions |

The same item can be suitable for a feed and unsuitable for a notification. Different surfaces have different error costs and constraints.

## 2. Predictions support a policy

A **policy** maps the available context to an action, possibly at random. Here the action might be an ordered list.

```text
inputs → predicted outcomes → eligible-item selection and ordering → displayed list
```

Predicted click probability, expected watch time, or a relevance score can inform selection. Scores need not be probabilities unless their downstream use requires that meaning.

A star-rating predictor can also help recommendations. Its rating error alone does not establish that it chooses a good top-six list.

## 3. Measure three different things

- **Prediction quality:** do estimated outcomes match observations?
- **List quality:** are useful items in good positions, with appropriate variety?
- **Product outcome:** does using the policy help users and meet the product's goals?

For example, a higher click rate can come with more disappointed viewers. Define success and counter-signals before optimizing a convenient proxy.

## 4. The system influences its evidence

You usually observe outcomes only after exposure. If a video was never displayed, its missing click is not a demonstrated rejection.

Past placement affects which observations reach training. This creates **exposure bias**—unequal opportunities to observe item outcomes—and can create **feedback loops**, where future recommendations reinforce past exposure.

> **Mental image:** a recommender is a shop window that learns from its own visitors. What it puts in the window changes what it can learn about next.
