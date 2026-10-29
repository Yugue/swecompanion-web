# Attention heads and shared keys/values

## 1. Use several information mixtures

**Multi-head attention** applies separate query, key, and value projections in several heads. Each head forms its own attention weights; their outputs are concatenated and projected back to model width.

Heads can learn different relationships, but there is no guarantee that one head corresponds to one interpretable linguistic rule.

## 2. Keep dimensions explicit

With model width d and H heads, a common head width is d/H. For d=512 and H=8, each head has width 64.

Each head normally reads all allowed sequence positions. Splitting feature width across heads does not split the sentence into eight unrelated pieces.

```genai-visual
multihead
```

## 3. Share keys and values

**Grouped-query attention (GQA)** lets multiple query heads share a key/value head. **Multi-query attention (MQA)** uses one shared key/value head. Ordinary multi-head attention gives each query head its own key/value head.

```genai-visual
grouped-heads
```

Each query still computes different attention weights. Four query heads sharing two KV heads store half as many key/value entries as four separate KV heads, at the same widths and sequence length. Quality depends on training and architecture.

## 4. Count the saved state

For T cached tokens, key width d_k, and value width d_v, each KV head stores T(d_k+d_v) values per layer. Reusing a KV head avoids storing duplicate projections for its query group.

Query projections and output combinations still run. Reducing KV heads is an architectural change that must be compatible with training or adaptation.

## 5. Avoid a head interpretation trap

Separate projections allow different mixtures, but a head need not correspond to a stable human label such as “syntax.” Its role depends on the layer and input.

Inspect measured quality, cache memory, and serving throughput rather than choosing the head count from interpretability alone.
