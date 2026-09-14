## Part V — Modern Deep-Learning Fundamentals  
### Topic 7: Key-Value (KV) Cache Basics

We already covered the motivation earlier, so here’s the **clean inference-level version** without repeating the whole Transformer lesson.

The central idea is:

\[
\boxed{\text{KV cache = store previous tokens' Keys and Values so we don't recompute them}}
\]

---

## 1. Without a KV cache

Suppose the model has already generated:

```text
"The cat sat on the"
```

and now wants to predict the next token.

Naively, at every generation step, the model could recompute:

```text
K₁, V₁
K₂, V₂
K₃, V₃
K₄, V₄
K₅, V₅
```

for all previous tokens again.

Then after generating one more token, recompute all of them again.

That is wasteful because the old tokens have not changed.

---

## 2. With a KV cache

At the first pass, compute the Keys and Values for the prompt and save them:

```text
token 1 → K₁, V₁
token 2 → K₂, V₂
token 3 → K₃, V₃
...
token N → Kₙ, Vₙ
```

Then when a new token arrives, only compute:

```text
Qnew, Knew, Vnew
```

Append:

```text
Kcache = [K₁, K₂, ..., Kₙ, Knew]
Vcache = [V₁, V₂, ..., Vₙ, Vnew]
```

and the new Query attends over all cached Keys:

\[
Q_{\text{new}}K_{\text{cache}}^T
\]

So:

> old K/V are reused; only the new token's projections are computed.

---

## 3. Why cache K and V, but not all old Queries?

This is a very good interview detail.

For generating the **next** token, the only Query we need is:

\[
Q_{\text{new}}
\]

We don't need old Queries again.

But the new Query must compare against all previous Keys:

\[
K_1,\ldots,K_N
\]

and then retrieve information from all previous Values:

\[
V_1,\ldots,V_N
\]

Therefore:

\[
\boxed{\text{cache K and V, not old Q}}
\]

---

## 4. Shapes

Suppose:

\[
B=\text{batch size}
\]

\[
H=\text{number of KV heads}
\]

\[
N=\text{cached sequence length}
\]

\[
d_h=\text{head dimension}
\]

Then approximately:

\[
K_{\text{cache}}:
(B,H,N,d_h)
\]

\[
V_{\text{cache}}:
(B,H,N,d_h)
\]

Every new generated token increases:

\[
N\rightarrow N+1
\]

So KV-cache memory grows linearly with sequence length:

\[
\boxed{O(N)}
\]

with respect to \(N\).

---

## 5. But attention still gets more expensive as context grows

This is an important nuance.

A KV cache does **not** make attention constant-time.

For the newest token:

```text
Qnew
 │
 ├── K₁
 ├── K₂
 ├── K₃
 ├── ...
 └── Kₙ
```

The new Query still has to compare against all previous Keys.

So the attention work for one new token grows roughly as:

\[
\boxed{O(Nd)}
\]

per layer.

What the cache saves is the cost of recomputing the old token representations and their K/V projections.

---

## 6. Prefill vs decode

This terminology is useful.

When you first give the model a prompt:

```text
"Explain how transformers work"
```

the model processes the whole prompt.

This is often called **prefill**.

```text
prompt
  ↓
process many tokens together
  ↓
build KV cache
```

Then generation begins.

Each new token is the **decode** phase:

```text
1 new token
   ↓
compute new Q/K/V
   ↓
reuse old KV cache
   ↓
predict next token
```

So:

\[
\boxed{\text{prefill = build the cache}}
\]

\[
\boxed{\text{decode = extend and reuse the cache}}
\]

---

## 7. Why long context uses so much inference memory

Suppose:

- 80 Transformer layers
- long context
- many attention heads
- large head dimension

Each layer needs its own Key and Value cache.

Conceptually:

```text
Layer 1: K,V cache
Layer 2: K,V cache
Layer 3: K,V cache
...
Layer 80: K,V cache
```

So KV-cache memory is roughly proportional to:

\[
\boxed{
B\times L\times N\times H_{kv}\times d_h\times 2
}
\]

where the factor 2 is:

\[
K+V
\]

This is why very long-context inference can become memory-heavy even when the model parameters themselves haven't changed.

---

## 8. Multi-Query and Grouped-Query Attention

This is worth knowing because it directly attacks KV-cache size.

In standard multi-head attention, you may have many separate Key/Value heads.

Modern models often use **Multi-Query Attention (MQA)** or **Grouped-Query Attention (GQA)**.

The idea is:

> Many Query heads share fewer Key/Value heads.

For example:

```text
32 Query heads
8 KV heads
```

instead of:

```text
32 Query heads
32 KV heads
```

That reduces KV-cache memory substantially.

So:

\[
\boxed{\text{fewer KV heads} \Rightarrow \text{smaller KV cache}}
\]

This is especially valuable for fast large-scale inference.

You don't need the full implementation details for now.

---

## 9. Why KV cache matters so much operationally

For one user, the cache may be manageable.

But imagine thousands of concurrent users:

```text
user 1 → long KV cache
user 2 → long KV cache
user 3 → long KV cache
...
```

Now inference servers must manage a large amount of per-request memory.

So KV cache becomes a major systems concern for:

- batching
- memory scheduling
- long-context serving
- high concurrency

This is one reason inference optimization is not just about FLOPs.

---

## 10. Minimal pseudo-code

Conceptually:

```python
k_cache = torch.cat([k_cache, k_new], dim=2)
v_cache = torch.cat([v_cache, v_new], dim=2)
```

Then:

```python
scores = q_new @ k_cache.transpose(-2, -1)
```

and the resulting attention weights are applied to:

```python
v_cache
```

---

## Interview answer

If asked:

> What is a KV cache?

A strong answer is:

> During autoregressive inference, previous tokens' Keys and Values do not change, so decoder-only Transformers cache them rather than recomputing them at every generation step. For each new token, the model computes only the new Query, Key, and Value, appends the new Key and Value to the cache, and attends over all cached Keys and Values. This greatly reduces repeated computation, although attention for each new token still grows with context length, and KV-cache memory grows linearly with the number of cached tokens.

The key mental model is:

```text
past tokens
   ↓
K,V computed once
   ↓
cached
   ↓
new token computes Qnew
   ↓
Qnew attends to cached K,V
```

And the three most important facts are:

\[
\boxed{\text{cache K,V — not old Q}}
\]

\[
\boxed{\text{KV memory scales }O(N)}
\]

\[
\boxed{\text{new-token attention still scans previous context}}
\]

That completes **Part V — Modern Deep-Learning Fundamentals**.
