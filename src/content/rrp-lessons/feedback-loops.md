## Feedback loops

A **feedback loop** occurs when recommendations affect exposure and behavior, which then affect training or future selection. The loop can reinforce a useful signal or amplify a misleading one.

It is a process over time, not a synonym for a popular catalogue.

## 1. Exposure changes the evidence

```rrp-visual
feedback-cycle
```

An item given more exposure can collect more clicks even without a higher click rate. A learner using total clicks as quality can then give it still more exposure.

Meanwhile, an item with few displays has less evidence and greater uncertainty. Treating that uncertainty as demonstrated low quality can keep it hidden.

Equal observed CTR does not prove equal intrinsic quality: audiences, placements, and small-sample noise can differ. Exposure concentration alone does not prove harmful causal amplification either.

## 2. Offline tests can inherit the loop

If training and evaluation both use data from the same narrow exposure policy, a model can score well while improving little outside that observed region.

An unseen item has no logged outcome to credit. Changes in list variety, inventory access, or long-term discovery can therefore be poorly represented by an ordinary next-click benchmark.

Offline evaluation remains useful for its defined task. It is incomplete evidence about the evolving population and all unobserved alternatives.

## 3. Monitor opportunities and outcomes together

| Observation | What else to inspect |
|---|---|
| Few items receive most impressions | Eligibility, demand, placements, provider concentration |
| New inventory gets no engagement | Whether it was represented, indexed, retrieved, or shown |
| Per-user lists narrow | Task intent, history, satisfied engagement, repeated exposure |
| CTR rises while discovery falls | Outcome definitions and experiment evidence |

Track distributions and trends, not only totals. An exposure share falling from 10% to 1% can be important even if overall clicks rise.

## 4. Gather evidence about alternatives

Controlled exploration can generate observations for uncertain eligible items. List variety, fresh-item budgets, and exposure limits can also change which evidence is collected, but are not automatically unbiased experiments.

Log the selection process and actual probabilities when needed. Estimate position effects with suitable variation. Compare policies using a design that can answer the intended causal question, including longer effects when relevant.

> **Mental image:** a spotlight moves toward what earlier light revealed. Keep track of the dark areas as well as the bright ones.
