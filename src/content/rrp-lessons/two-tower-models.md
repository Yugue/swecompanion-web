## Two-tower retrieval

A **two-tower model** separately encodes a request and an item into compatible vectors, then combines them with a cheap score such as a dot product.

The separation allows item-side work to happen ahead of the request.

## 1. Encode items once, requests as needed

```rrp-visual
two-tower
```

\[
u=f(\text{user, history, query, context}),\qquad
v_i=g(\text{item features}),\qquad s_i=u^\top v_i
\]

An item encoder independent of the current request can compute and store each \(v_i\). A request computes \(u\) once, then searches those stored vectors.

The request tower may include a query or anonymous session; it need not depend on a logged-in user ID. Item vectors must be refreshed when required inputs change, such as dynamic metadata.

## 2. Independence limits direct inputs, not all interaction

A user tower can encode a preferred price range and an item tower its price. Their dot product can model compatibility.

An arbitrary lookup of “how many times this specific user watched this specific candidate” cannot be a direct input to the independently computed item vector or single request vector. A joint ranker can consume that candidate-specific feature after retrieval.

The tradeoff is restricted scoring structure in exchange for efficient reuse. Richer interaction models can also be used for small pools; they do not provide the same simple catalogue-wide precomputation.

## 3. Train using observed and contrasting items

A sampled contrastive objective raises the positive item's score relative to sampled alternatives:

\[
\ell=-\log\frac{\exp(s_{positive}/\tau)}{\sum_{j\in S}\exp(s_j/\tau)}
\]

\(S\) contains the positive and sampled competitors. **Temperature** \(\tau>0\) controls the scale inside this softmax, changing probability concentration and training gradients.

The sampling distribution changes what is learned. If the intended objective approximates a full-catalogue softmax, an appropriate sampling correction may be needed. Not every contrastive objective uses the same correction.

Scores are retrieval compatibility, not automatically production click probabilities. Hold out later interactions and evaluate against realistic eligible competition.

## 4. Publish a compatible bundle

Deploy request tower, item tower, preprocessing, score convention, and index as compatible versions. Comparing a newly trained request vector with unrelated old item coordinates can silently break retrieval.

A feature-based item tower can encode a new listing without retraining. Making it retrievable still requires index insertion and eligibility checks. Measure that publication delay separately from model-training cadence.

> **Mental image:** two independently prepared keys fit through one shared compatibility test. Their shared coordinate convention makes precomputation useful.
