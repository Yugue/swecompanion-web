## Implicit feedback and its biases

**Implicit feedback** is behavioral evidence such as clicks, viewing, purchases, or hides. **Explicit feedback** directly asks for an evaluation, such as a rating or thumbs-up.

Neither is a complete or automatically honest measurement of preference. People who rate are self-selected; people who click can be responding to a misleading title.

## 1. Name what the signal actually measures

| Signal | Evidence it supplies | Important limit |
|---|---|---|
| Click | An item attracted a click after exposure | Can reflect curiosity or presentation |
| Watch duration | How long viewing continued | Depends on duration, autoplay, and stopping behavior |
| Purchase | A transaction occurred | Availability, price, and returns matter |
| Hide or complaint | An explicit negative action | Rare and selected by who reports |

A deeper event is not universally a better target. Choose evidence that fits the product's intended benefit and measurement window.

## 2. Non-click is a mixture of explanations

Imagine 1,000 displayed tiles. Suppose 300 were examined and 30 clicked:

```text
700 not examined
270 examined, no click
 30 clicked
```

An impression-and-click log records 970 non-clicks. Without additional evidence, it cannot separate the first two groups. Even examination without a click can reflect timing or competing choices rather than dislike.

A non-click can still be a valid negative for “click under this display policy.” Interpreting it as intrinsic item irrelevance requires stronger assumptions.

## 3. Separate the biases

- **Exposure bias:** the serving policy determines which user–item outcomes are observable.
- **Position bias:** placement changes attention and clicking, even for the same item.
- **Popularity bias:** counts and learned decisions can favor frequently exposed items.

These can coexist. Correcting one does not automatically identify unseen preferences or remove the others.

## 4. Improve evidence and evaluation

Log displays, positions, viewability when measurable, outcomes, and the policy version. Track satisfaction-related counter-signals alongside the main target.

Controlled **exploration** varies eligible recommendations to collect evidence about uncertain alternatives. Suitable experiments can also help estimate placement effects. Record the actual randomization probabilities if later evaluation needs them.

Train on a precisely defined proxy and state where it can diverge from the desired outcome. For example: “We predict clicks, but validate useful viewing and complaints because a tempting thumbnail may disappoint after opening.”

> **Mental image:** behavior is a trace of both interest and opportunity. Read the trace together with how the opportunity was created.
