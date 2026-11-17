# Inference memory: weights, states, and KV cache

## 1. Inventory the requirement

**Inference memory** includes weights, KV state, temporary activations, and runtime overhead. Conversations share weights but retain separate sequence state.

## 2. Estimate weights

For N parameters and b bytes per stored parameter, weight storage is approximately Nb. Seven billion parameters at two bytes each occupy about 14 GB in decimal units before overhead.

## 3. Estimate the KV cache

\[
M_{KV}\approx 2LBTH_{kv}d_hb
\]

L is layer count; B active sequence count; T cached positions per sequence; \(H_{kv}\) key/value head count; \(d_h\) head width; b bytes per value. Two counts keys and values.

With L=32, B=1, T=4096, \(H_{kv}\)=8, \(d_h\)=128, b=2, the estimate is 512 MiB. Unequal sequence lengths require summing their actual lengths.

## 4. Compare concurrency and length

In the stated example, one 4,096-position sequence uses 512 MiB of KV state. Four equally long sequences need about 2 GiB. Halving their cached length halves that component.

Weight memory stays shared at a fixed model configuration. A smaller weight format does not automatically reduce KV storage.

## 5. Include real overhead

Reserve computation buffers and allocation headroom; measure realistic peak usage. GB=10⁹ bytes, GiB=2³⁰, MiB=2²⁰.

> **Reason it through:** Concurrent history lengths double while weights stay fixed. Which memory term grows, and by how much?
