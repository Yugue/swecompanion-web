## What a recommender actually does

## 1. Choose a useful window into the catalogue

A **recommendation system** selects items for a person and context. A video service might choose six videos from millions.

> Think of a shop window: the selection matters more than assigning every product a number.

## 2. Prediction, ranking, personalization

| Concept | Job |
|---|---|
| Prediction | Estimate an outcome, such as clicking |
| Ranking | Order candidate items |
| Personalization | Adapt choices using user or session information |

A popular-items list recommends without necessarily personalizing.

## 3. Define the surface

A **surface** is where recommendations appear: home feed, search, up-next, or notifications.

A useful video may suit a feed but not justify interrupting someone with a notification. The surface changes the decision and its error costs.

## 4. Scores support a policy

A **policy** maps available context to an action, possibly at random. The action can be a single item or an ordered list, called a **slate**.

```text
context → predicted outcomes → list selection → display
```

A score can express compatibility without being a probability.

## 5. Separate three kinds of success

- **Prediction:** did estimates match recorded outcomes?
- **List:** were useful items placed well?
- **Product:** did deploying this policy help users?

Lower rating error does not establish a better top-six list.

## 6. Choose an outcome users value

A tempting thumbnail can increase clicks while disappointing viewers. Measure useful viewing and unwanted recommendations alongside clicks.

The system's displayed choices determine much of the evidence it later learns from. The feedback chapters explain that mechanism.

## 7. Interview reasoning

**Question:** Why is predicting ratings different from choosing six videos?

**Answer:** Rating prediction evaluates individual estimates. Selection must also decide which candidates enter the list, their order, and how the whole list serves the current request.
