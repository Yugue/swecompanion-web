## Two-tower retrieval

## 1. Prepare the two sides independently

A **two-tower model** separately encodes a request and an item, then combines their vectors with a cheap score. Item-side computation can happen ahead of the request.

## 2. Follow the two paths

```rrp-visual
two-tower
```

\[
u=f(x),\qquad v_i=g(z_i),\qquad s_i=u^\top v_i
\]

\(x\): user/query/history/context; \(z_i\): item inputs; \(f,g\): encoders; \(u,v_i\): output vectors; \(s_i\): score.

Compute \(u\) once and search stored \(v_i\) values.

## 3. Understand the independence constraint

Separate vectors can encode preferred price and item price, then model compatibility.

An arbitrary lookup of “this user's views of this exact candidate” cannot directly enter either independently computed vector. A later joint ranker can use it.

## 4. Train competing scores

A **contrastive objective** raises an observed item's score relative to alternatives. One sampled-softmax loss is:

\[
a_j=\frac{\exp(s_j/\tau)}{\sum_{k\in S}\exp(s_k/\tau)},\qquad
\ell=-\log a_+
\]

\(S\): positive plus sampled alternatives; \(j,k\): item indices; \(s_j\): score; \(a_j\): **softmax** share, normalized exponential score; \(a_+\): positive share; \(\ell\): loss.

**Temperature** \(\tau>0\) controls concentration; smaller values sharpen differences.

## 5. Send error through both towers

\[
\frac{\partial\ell}{\partial s_j}=\frac{a_j-y_j}{\tau}
\]

\(y_j\) is 1 for the positive and 0 for an alternative. The positive receives an upward score push; alternatives receive downward pushes.

**Backpropagation** applies the chain rule to carry these sensitivities through the dot product and into encoder parameters. Shared parameters couple the resulting score changes.

## 6. Work one lookup-vector step

For a toy model whose parameters are vector-table entries, use one positive and one negative, \(\tau=1\), and learning rate 0.1:

| Parameter | Before | After |
|---|---|---|
| Request u | [1,0] | [1,0.1] |
| Positive vector | [0,1] | [0.05,1] |
| Negative vector | [0,−1] | [−0.05,−1] |

Initially both shares are 0.5. The request gradient is [0,−1]; the item gradients are [−0.5,0] and [0.5,0]. Updated scores are **0.15/−0.15**; loss falls **0.693 → 0.554**.

## 7. Keep the objective and sampling aligned

The next chapter explains contrast selection and objective-specific corrections. Sampled softmax shares are not production click probabilities.

More complex encoders update their weights through the output-vector derivatives; they need not reproduce the toy table's changes.

## 8. Publish compatible coordinates

Version encoders, preprocessing, scoring, and item index together. A new request encoder can fail against unrelated old item coordinates even when dimensions match.

Refresh stored vectors when required inputs or model versions change.

## 9. Interview reasoning

**Question:** What makes two towers efficient, and what expressiveness is lost?

**Answer:** Reusable item vectors and one request encoding permit cheap indexed scoring. Arbitrary joint candidate inputs require another scoring path.
